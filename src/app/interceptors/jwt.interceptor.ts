// src/app/interceptors/auth-token.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { ApiService } from '../services/api.service'; // Asegúrate de tener tu AuthService

@Injectable() // <--- ¡Importante! En módulos, los interceptores también necesitan ser @Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(private authService: ApiService) {} // Puedes inyectar servicios si los necesitas

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 1. Añadir el token de acceso a la petición original
    request = this.addToken(request, this.authService.getAccessToken());
    this.authService.extendSession();
    // 2. Manejar la petición y capturar errores
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Si es un 401, intentar refrescar el token y reintentar la petición
          return this.handle401Error(request, next);
        } else {
          // Para otros errores, simplemente relanzarlos para que sean manejados por la capa superior
          return throwError(() => error);
        }
      })
    );
  }

  // Método auxiliar para añadir el token de autenticación a la petición
  private addToken(request: HttpRequest<any>, token: string | null): HttpRequest<any> {
    if (token) {
      return request.clone({
        setHeaders: {
          'x-auth-token': token
      }
      });
    }
    return request;
  }

  // Lógica para manejar el error 401: refrescar token y reintentar la petición
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si ya hay un refresco de token en progreso
    if (this.authService.checkAuthStatus()) {
      // Las peticiones en cola esperan a que el token se refresque
      return this.authService.tokenRefreshed$.pipe(
        filter(token => token !== null), // Espera hasta que tokenRefreshedSubject emita un nuevo token (no null)
        take(1), // Toma solo el primer valor (el nuevo token)
        switchMap((newAccessToken) => {
          // Reintentar la petición original con el nuevo token
          return next.handle(this.addToken(request, newAccessToken));
        })
      );
    } else {
      // Si no hay un refresco en progreso, iniciar uno
      // authService.refreshToken() maneja la bandera isRefreshingTokenRequest
      return this.authService.refreshToken().pipe(
        switchMap((newAccessToken) => { // Cuando el refresco es exitoso, obtenemos el newAccessToken
          // Reintentar la petición original con el nuevo token
          return next.handle(this.addToken(request, newAccessToken));
        }),
        catchError((refreshError) => {
          // Si el refresco falla, ya el AuthService.logout() se encargó de redirigir.
          // Aquí simplemente relanzamos el error de refresco para que la petición original también falle.
          return throwError(() => refreshError);
        })
      );
    }
  }
}
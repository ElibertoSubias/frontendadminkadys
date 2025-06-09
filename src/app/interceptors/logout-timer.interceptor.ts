// src/app/interceptors/logout-timer.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

@Injectable()
export class LogoutTimerInterceptor implements HttpInterceptor {

  private activeRequests = 0; // Contador de peticiones HTTP activas

  constructor(private authService: ApiService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Incrementa el contador de peticiones activas
    this.activeRequests++;
    console.log(`LogoutTimerInterceptor: Petición iniciada. Peticiones activas: ${this.activeRequests}`);

    // Si esta es la primera petición activa, limpia el temporizador de logout
    if (this.activeRequests === 1) {
      console.log('LogoutTimerInterceptor: Primera petición activa. Limpiando temporizador de logout.');
      this.authService.clearLogoutTimer();
    }

    return next.handle(request).pipe(
      finalize(() => {
        // Decrementa el contador de peticiones activas
        this.activeRequests--;
        console.log(`LogoutTimerInterceptor: Petición finalizada. Peticiones activas: ${this.activeRequests}`);

        // Si esta fue la última petición activa y el usuario sigue logueado, reinicia el temporizador de logout
        if (this.activeRequests === 0 && this.authService.checkAuthStatus()) {
          console.log('LogoutTimerInterceptor: Última petición activa finalizada. Reiniciando temporizador de logout.');
          this.authService.resetSessionActivity(); // Llama al método para reiniciar los temporizadores
        }
      })
    );
  }
}
import { HttpClient } from "@angular/common/http";
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject, Observable, Subject, catchError, filter, finalize, mapTo, of, take, tap, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode
import Swal from "sweetalert2";


// Interfaz para almacenar los datos del Refresh Token junto con su expiración
interface RefreshTokenData {
    token: string;
    exp: number; // Timestamp de expiración del Refresh Token
  }

// Interfaz para la estructura del payload decodificado del JWT
interface DecodedToken {
    exp: number; // Timestamp de expiración (segundos desde la época)
    iat: number; // Timestamp de emisión
    sub: string; // Sujeto (ej. nombre de usuario)
    role?: string; // Rol del usuario (ejemplo de un claim adicional)
    id?: number;
}

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    constructor(
        private http : HttpClient,
        private cookies : CookieService,
        private router : Router,
        @Inject(PLATFORM_ID) private platformId: Object // Para detectar si estamos en el navegador
    ) {

    }

    // Internal state to track if initialization is in progress
    private _isInitializingAuth = new BehaviorSubject<boolean>(true); // Start as true
    public readonly isInitializingAuth$ = this._isInitializingAuth.asObservable(); // Expose as Observable

    // BehaviorSubject para mantener el estado de autenticación de forma reactiva
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

    // Claves para localStorage
    private readonly TOKEN_KEY = environment.TOKEN_KEY;
    private readonly REFRESH_TOKEN_DATA_KEY = environment.REFRESH_TOKEN_DATA_KEY;
    private readonly WARNING_TIME_BEFORE_EXPIRATION_MINUTES = environment.WARNING_TIME_BEFORE_EXPIRATION_MINUTES; // Aviso 5 minutos antes de expirar
    private readonly LOGOUT_AFTER_WARNING_MINUTES = environment.LOGOUT_AFTER_WARNING_MINUTES; // Nuevo: Logout 1 minuto después del aviso si no hay interacción
    // Constante: Refrescar 5 minutos ANTES de que el access token expire
    private readonly TOKEN_REFRESH_BUFFER_SECONDS = environment.TOKEN_REFRESH_BUFFER_SECONDS;
    // Constantes para el refresco proactivo y extensión de sesión
    private readonly EXTEND_SESSION_BUFFER_SECONDS = 60; // Extender sesión 1 minuto ANTES de que el token expire


    private sessionTimer: any;
    private sessionWarning$ = new Subject<void>();
    private sessionLogoutTimer: any; // Nuevo temporizador para el logout automático
    public onSessionWarning: Observable<void> = this.sessionWarning$.asObservable();

    private tokenRefreshTimer: any; // Nuevo temporizador para el refresco proactivo

    private isRefreshingTokenRequest = false;
    // Bandera pública para controlar la condición de carrera del refresco del token en el interceptor
    public isRefreshingToken = false; // <<< HECHO PÚBLICO para acceso desde el interceptor
    // BehaviorSubject para notificar a las peticiones en espera cuando el token ha sido refrescado
    private tokenRefreshedSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

    // Observable que los interceptores pueden subscribir para esperar por el nuevo token
    public tokenRefreshed$: Observable<string | null> = this.tokenRefreshedSubject.asObservable();


    login(usuario: any): Observable<any> {
        // return this.http.post(`${environment.appBaseUrl}/auth`, usuario);
        return this.http.post<{ accessToken: string, refreshToken: string }>(`${environment.apiLogin}/auth/login`, { usuario: usuario.usuario, contrasenia: usuario.contrasenia }).pipe(
            tap(response => {
              const now = Math.floor(Date.now() / 1000);
              // Decodificamos el Access Token para obtener su expiración (exp)
              const decodedAccessToken = this.decodeToken(response.accessToken);
              if (!decodedAccessToken || !decodedAccessToken.exp) {
                throw new Error('Access Token inválido o sin fecha de expiración.');
              }
      
              // Decodificamos el Refresh Token para obtener su expiración (si el backend lo envía como JWT)
              // O lo calculamos si el backend no envía expiración en el refresh token (y lo maneja en DB)
              // Por simplicidad, asumimos que el backend gestiona la expiración del refresh token
              // y que este será validado al refrescar. Para el FE, solo nos interesa que exista.
              const refreshTokenData: RefreshTokenData = {
                token: response.refreshToken,
                // Si tu Refresh Token también es un JWT, lo decodificarías para obtener su 'exp'
                // De lo contrario, puedes poner una expiración muy lejana en el cliente
                exp: now + (365 * 24 * 60 * 60) // Simular 1 año si el backend no envía 'exp' en el RT
              };
      
              this.saveTokens(response.accessToken, refreshTokenData);
              this.isAuthenticatedSubject.next(true);
              this.router.navigate(['/home']);
              console.log('Login exitoso! Tokens guardados.');
            }),
            catchError(error => {
              console.error('Error en el login:', error);
              this.removeTokens();
              this.isAuthenticatedSubject.next(false);
              return throwError(() => new Error(error.error?.message || 'Credenciales inválidas.'));
            })
        );
    }

    // 3. **Modificar initializeAuth para iniciar el ciclo de refresco al cargar la app**
    initializeAuth(): Observable<boolean> {
        this._isInitializingAuth.next(true);
        const accessToken = this.getAccessToken();
        const refreshTokenData = this.getRefreshTokenData();
        const isRefreshTokenValid = refreshTokenData && (refreshTokenData.exp * 1000) > Date.now();

        if (accessToken && isRefreshTokenValid) {
        const accessTokenExpiration = this.getTokenExpiration(accessToken);
        if (accessTokenExpiration && accessTokenExpiration.getTime() > Date.now()) {
            console.log('AuthService: Inicializando auth: Access token válido. Programando refresco.');
            this.startSessionTimer();
            this.scheduleTokenRefresh();
            this.scheduleExtendSession();
            // this.scheduleTokenRefresh(); // ¡Programa el refresco al iniciar si los tokens son válidos!
            this._isInitializingAuth.next(false);
            return of(true);
        } else {
            console.log('AuthService: Inicializando auth: Access token expirado. Intentando refresco...');
            // refreshToken() llamará a setTokens() en caso de éxito, lo que a su vez programa el próximo refresco
            return this.refreshToken().pipe(
            mapTo(true),
            catchError((err) => {
                console.error('AuthService: Inicializando auth: Fallo al refrescar durante la inicialización.', err);
                this.logout();
                this._isInitializingAuth.next(false);
                return of(false);
            })
            );
        }
        } else {
        console.log('AuthService: Inicializando auth: No hay tokens válidos o el refresh token ha expirado. Cerrando sesión.');
        this.logout();
        this._isInitializingAuth.next(false);
        return of(false);
        }
    }

    // --- Lógica del temporizador de extensión de sesión (EXTEND_SESSION_BUFFER_SECONDS) ---
    private extendSessionTimer: any;
    private scheduleExtendSession(): void {
        this.clearExtendSessionTimer();
        const accessToken = this.getAccessToken();
        if (!accessToken) { return; }
        const expirationDate = this.getTokenExpiration(accessToken);
        if (!expirationDate) { return; }

        const now = new Date();
        const timeUntilExpirationSeconds = (expirationDate.getTime() - now.getTime()) / 1000;
        const timeToCallExtendSessionSeconds = timeUntilExpirationSeconds - this.EXTEND_SESSION_BUFFER_SECONDS;

        if (timeToCallExtendSessionSeconds <= 0) {
        console.log('AuthService: Access token ya pasó el umbral de 1 minuto. Intentando extensión inmediata (si aplica).');
        // this.extendSession().subscribe(...); // Descomenta si quieres llamarla inmediatamente
        } else {
        console.log(`AuthService: Programando extensión de sesión en ${timeToCallExtendSessionSeconds} segundos.`);
        this.extendSessionTimer = setTimeout(() => {
            console.log('AuthService: Llamando extendSession() al aproximarse el token al minuto de expiración.');
            this.extendSession();
        }, timeToCallExtendSessionSeconds * 1000);
        }
    }

    private clearExtendSessionTimer(): void {
        if (this.extendSessionTimer) {
          clearTimeout(this.extendSessionTimer);
          this.extendSessionTimer = null;
          console.log('AuthService: Temporizador de extensión de sesión limpiado.');
        }
    }

    // --- Método central para programar el refresco del token ---
    private scheduleTokenRefresh(): void {
        this.clearTokenRefreshTimer(); // Primero, limpia cualquier temporizador existente

        const accessToken = this.getAccessToken();
        if (!accessToken) {
        console.warn('AuthService: No access token para programar el refresco. Saltando.');
        return;
        }

        const expirationDate = this.getTokenExpiration(accessToken);
        if (!expirationDate) {
        console.error('AuthService: No se pudo determinar la expiración del access token. Saltando refresco proactivo.');
        return;
        }

        const now = new Date();
        const timeUntilExpirationSeconds = (expirationDate.getTime() - now.getTime()) / 1000;
        const timeToRefreshSeconds = timeUntilExpirationSeconds - (this.TOKEN_REFRESH_BUFFER_SECONDS * 60);

        if (timeToRefreshSeconds <= 0) {
        // Si el token ya expiró o está dentro del buffer de tiempo, intentar refrescar inmediatamente
        console.log('AuthService: Access token muy cerca de expirar o ya expiró. Intentando refresco inmediato.');
        this.refreshToken().subscribe({
            next: () => console.log('AuthService: Refresco inmediato exitoso.'),
            error: (err) => console.error('AuthService: Refresco inmediato fallido.', err)
        });
        } else {
        // Programar el refresco para que ocurra antes de la expiración real
        console.log(`AuthService: Programando refresco de token en ${timeToRefreshSeconds} segundos.`);
        this.tokenRefreshTimer = setTimeout(() => {
            console.log('AuthService: Refresco proactivo de token disparado por temporizador.');
            this.refreshToken().subscribe({
            next: () => {
                // No necesitas llamar a scheduleTokenRefresh() aquí;
                // setTokens() (llamado por refreshToken en caso de éxito) lo hará por ti.
                console.log('AuthService: Refresco proactivo exitoso y próximo refresco programado.');
            },
            error: (err) => {
                console.error('AuthService: Refresco proactivo fallido.', err);
                // El método refreshToken() ya maneja el logout en caso de error
            }
            });
        }, timeToRefreshSeconds * 1000); // Convertir segundos a milisegundos
        }
    }

    // --- Método para limpiar el temporizador de refresco ---
    private clearTokenRefreshTimer(): void {
        if (this.tokenRefreshTimer) {
        clearTimeout(this.tokenRefreshTimer);
        this.tokenRefreshTimer = null;
        console.log('AuthService: Temporizador de refresco de token limpiado.');
        }
    }

    private removeTokens(): void {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem(this.TOKEN_KEY);
          localStorage.removeItem(this.REFRESH_TOKEN_DATA_KEY);
        }
    }

    // **IMPORTANTE: Método para reiniciar la actividad de la sesión**
    // Este es el método que será llamado por el interceptor
    resetSessionActivity(): void {
        console.log('AuthService: Actividad HTTP detectada. Reiniciando temporizadores de sesión.');
        // `startSessionTimer()` se encarga de limpiar los temporizadores anteriores y volver a programarlos.
        // Los temporizadores de refresco y extensión ya se programan con `setTokens` e `initializeAuth`.
        this.startSessionTimer();
    }

    // --- Métodos de Ayuda para Gestión de Tokens en localStorage ---
    private saveTokens(accessToken: string, refreshTokenData: RefreshTokenData): void {
        if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.TOKEN_KEY, accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_DATA_KEY, JSON.stringify(refreshTokenData));
        this.startSessionTimer(); // <-- Importante: iniciar el temporizador aquí
        // this.scheduleTokenRefresh(); // ¡Aquí se programa el próximo refresco!
        console.log('AuthService: Guardando en localStorage -> TOKEN_KEY:', this.TOKEN_KEY, 'Valor:', accessToken); // Log de depuración
        }
    }

    // Nuevo método para limpiar el temporizador de logout
    clearLogoutTimer(): void {
        if (this.sessionLogoutTimer) {
        clearTimeout(this.sessionLogoutTimer);
        this.sessionLogoutTimer = null;
        console.log('Temporizador de logout automático limpiado.');
        }
    }

    getTokenExpiration(token: string): Date | null {
        try {
          const decoded: DecodedToken = jwtDecode(token);
          // 'exp' está en segundos, Date espera milisegundos
          return new Date(decoded.exp * 1000);
        } catch (error) {
          console.error('Error al decodificar el token:', error);
          return null;
        }
    }

    // Llama a esto después de login o refresco exitoso
    startSessionTimer(): void {
        this.clearSessionTimer(); // Limpia cualquier temporizador anterior
        this.clearLogoutTimer(); // Limpia cualquier temporizador de logout anterior


        const token = this.getAccessToken();
        if (!token) {
        return;
        }

        const expirationDate = this.getTokenExpiration(token);
        if (!expirationDate) {
        return;
        }

        const currentTime = new Date();
        const timeUntilExpirationMs = expirationDate.getTime() - currentTime.getTime();
        const warningThresholdMs = this.WARNING_TIME_BEFORE_EXPIRATION_MINUTES * 60 * 1000;
        
        console.log(`Logout automático programado para dentro de ${this.LOGOUT_AFTER_WARNING_MINUTES} minuto(s) si no hay interacción.`);

        // *** LÓGICA CLAVE PARA EVITAR REDISPARO INMEDIATO ***
        // Si el tiempo restante hasta la expiración es menor o igual al umbral de advertencia,
        // significa que ya deberíamos haber advertido o que la sesión ya expiró o está muy cerca.
        // En este caso, NO configuramos un nuevo setTimeout para el aviso, porque ya se manejó
        // o está por ser manejado por el interceptor/guard.
        if (timeUntilExpirationMs <= warningThresholdMs) {
        // Si la sesión ya expiró o está muy cerca, podemos forzar el logout o dejar que el interceptor lo maneje.
        // Aquí, podemos optar por mostrar el aviso y luego forzar el logout si el tiempo ya pasó.
        if (timeUntilExpirationMs > 0) { // Si aún no ha expirado del todo, damos el aviso y el timer de logout
            this.sessionWarning$.next();
            // Swal.fire({
            //     title: `Tu sesión expirará en ${environment.WARNING_TIME_BEFORE_EXPIRATION_MINUTES} minutos. ¿Quieres extenderla?`,
            //     text: "¿Desea continuar?",
            //     icon: "warning",
            //     showCancelButton: true,
            //     confirmButtonColor: "#3085d6",
            //     cancelButtonColor: "#d33",
            //     confirmButtonText: "Si",
            //     cancelButtonText: `No`
            //   }).then((result) => {
            //     if (result.isConfirmed) {
            //       this.extendSession()
            //     } else {
            //       this.logout();
            //     }
            //     // this.router.navigate([`/dress/${this.id}`]);
            //   });
            console.warn('¡Tu sesión está a punto de expirar! (Disparo inmediato)');
            this.startLogoutTimer(); // Inicia el temporizador de logout inmediatamente si ya estamos en el umbral
        } else { // Si ya expiró completamente, simplemente cerramos la sesión
            this.logout();
        }
        return;
        }

        // Calcular cuándo mostrar el aviso (la próxima vez)
        const timeUntilWarningMs = timeUntilExpirationMs - warningThresholdMs;

        console.log(`Nuevo aviso de sesión programado para dentro de ${timeUntilWarningMs / 1000 / 60} minutos.`);

        this.sessionTimer = setTimeout(() => {
            this.sessionWarning$.next(); // Dispara el aviso
            console.warn('¡Tu sesión está a punto de expirar!');
            this.startLogoutTimer(); // <<-- Debería llamarse aquí
        }, timeUntilWarningMs);
    }

    extendSession(): void {
        // Ocultar el mensaje inmediatamente al hacer clic en "Extender Sesión"
        // this.showSessionWarning = false;
        // Si usas OnPush strategy
        // this.cdr.detectChanges();
        // this.isLoading = true; // Activa el cargando
      
        this.refreshToken().pipe(
          finalize(() => {
            // this.isLoading = false; // Desactiva el cargando SIEMPRE al finalizar
          })
        ).subscribe({
          next: () => {
            // No necesitas ocultarlo aquí de nuevo, ya lo hiciste.
            // Pero si quieres ser super seguro, podrías ponerlo.
            // this.showSessionWarning = false;
            // this.cdr.detectChanges(); // si usas OnPush
            console.log('Sesión extendida. El temporizador de aviso se reinició en AuthService.');
            // startSessionTimer se llama dentro de setTokens en AuthService
          },
          error: (err) => {
            console.error('No se pudo extender la sesión.', err);
            // this.showSessionWarning = false; // Ocultar si falla y se va a logout
            // this.cdr.detectChanges(); // si usas OnPush
            this.logout();
          }
        });
    }

    // Nuevo método para iniciar el temporizador de logout
    private startLogoutTimer(): void {
        this.clearLogoutTimer(); // Asegúrate de limpiar cualquier temporizador existente

        const logoutDelayMs = this.LOGOUT_AFTER_WARNING_MINUTES * 60 * 1000;
        console.log(`Logout automático programado para dentro de ${this.LOGOUT_AFTER_WARNING_MINUTES} minuto(s) si no hay interacción.`);

        this.sessionLogoutTimer = setTimeout(() => {
            console.log('Tiempo de aviso expirado. Cerrando sesión automáticamente.');
            Swal.close(),
            this.logout(); // Fuerza el cierre de sesión
        }, logoutDelayMs);
    }

    // Método para limpiar el temporizador del aviso
    clearSessionTimer(): void {
        if (this.sessionTimer) {
        clearTimeout(this.sessionTimer);
        this.sessionTimer = null;
        console.log('Temporizador de aviso de sesión limpiado.');
        }
    }

    logout(): void {
        this.removeTokens();
        this.isAuthenticatedSubject.next(false);
        this.clearSessionTimer(); // Limpia el temporizador de advertencia
        this.clearLogoutTimer();
        this.clearTokenRefreshTimer(); // ¡Aquí se limpia el temporizador de refresco!    
        this.router.navigate(['/login']);
        console.log('Sesión cerrada. Tokens eliminados.');
    }

     // Método usado por el AuthGuard y otros para verificar el estado de autenticación en tiempo real
    checkAuthStatus(): boolean {
        console.log('AuthService.checkAuthStatus() called.');
        const token = this.getAccessToken();
        const authenticated = !!token && !this.isTokenExpired(token);
        console.log('  Auth status from checkAuthStatus():', authenticated, 'Token present:', !!token);
        // Aseguramos que el BehaviorSubject refleje el estado real
        if (this.isAuthenticatedSubject.getValue() !== authenticated) {
            this.isAuthenticatedSubject.next(authenticated);
        }
        return authenticated;
    }

    getRefreshTokenData(): RefreshTokenData | null {
        if (isPlatformBrowser(this.platformId)) {
          const data = localStorage.getItem(this.REFRESH_TOKEN_DATA_KEY);
          return data ? JSON.parse(data) : null;
        }
        return null;
    }

    // MODIFICADO: Ahora hace una petición POST al backend para refrescar
    refreshToken(): Observable<any> {
        if (this.isRefreshingToken) {
        return this.tokenRefreshedSubject.asObservable().pipe(
            filter((token): token is string => token !== null),
            take(1)
        );
        }

        this.isRefreshingToken = true;
        this.tokenRefreshedSubject.next(null);

        const currentRefreshTokenData = this.getRefreshTokenData();

        if (!currentRefreshTokenData) { // Ya no necesitamos isRefreshTokenExpired(currentRefreshTokenData) aquí, el backend lo hará
        console.error('Refresh Token no encontrado. Necesita iniciar sesión de nuevo.');
        this.isRefreshingToken = false;
        this.logout();
        return throwError(() => new Error('Refresh Token no encontrado'));
        }

        console.log('Intentando refrescar Access Token con backend...');

        return this.http.post<{ accessToken: string, refreshToken: string }>(`${environment.apiLogin}/auth/refresh-token`, { refreshToken: currentRefreshTokenData.token }).pipe(
        tap(response => {
            const now = Math.floor(Date.now() / 1000);
            const refreshTokenData: RefreshTokenData = {
            token: response.refreshToken,
            exp: now + (365 * 24 * 60 * 60) // Simular 1 año si el backend no envía 'exp' en el RT
            };
            this.saveTokens(response.accessToken, refreshTokenData);
            this.isAuthenticatedSubject.next(true);
            this.isRefreshingToken = false;
            this.tokenRefreshedSubject.next(response.accessToken);
            console.log('Access Token refrescado exitosamente desde el backend.');
        }),
        catchError((error) => {
            console.error('Error al refrescar el token desde el backend:', error);
            this.isRefreshingToken = false;
            this.tokenRefreshedSubject.next(null);
            this.logout(); // Si el refresh falla, cerrar sesión
            return throwError(() => new Error(error.error?.message || 'Error al refrescar el token.'));
        })
        );
    }

    // --- Función de Ayuda para Decodificar Base64URL (compatible con JWT) ---
    // Resuelve el error InvalidCharacterError al decodificar JWTs
    private urlBase64Decode(str: string): string {
        let output = str.replace(/-/g, '+').replace(/_/g, '/'); // Convierte Base64URL a Base64 estándar
        switch (output.length % 4) { // Añade padding si es necesario
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            console.error('urlBase64Decode: Longitud de cadena Base64URL inválida antes del relleno. Longitud:', output.length);
            throw new Error('Illegal base64url string length!');
        }

        try {
        // Decodifica la Base64 a una cadena binaria (que puede contener caracteres no Latin-1)
        const decodedBinaryString = atob(output);
        // Convierte la cadena binaria (que puede ser UTF-8) a una cadena de caracteres JavaScript
        // Esto maneja correctamente caracteres Unicode (acentos, eñes, etc.)
        return decodeURIComponent(decodedBinaryString.split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        } catch (e) {
        console.error('urlBase64Decode: ERROR CRÍTICO durante atob() o decodificación UTF-8.',
                        'Cadena procesada para atob():', output,
                        'Error específico:', e);
        throw e; // Relanza el error
        }
    }

    // Decodifica el payload de un JWT
    private decodeToken(token: string): DecodedToken | null {
        if (!token) {
        console.warn('decodeToken: El token es nulo o vacío.');
        return null;
        }
        try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('decodeToken: Formato de JWT inválido. Se esperaban 3 partes, se obtuvieron:', parts.length, 'Token recibido (parcial):', token.substring(0, 50) + '...');
            return null;
        }
        const payloadBase64 = parts[1];
        const decodedPayload = this.urlBase64Decode(payloadBase64);
        return JSON.parse(decodedPayload);
        } catch (e) {
        console.error('Error al decodificar el token (en la función decodeToken):', e);
        return null;
        }
    }

    isTokenExpired(token: string | null): boolean {
        if (!token) return true;
    
        const decoded = this.decodeToken(token);
        if (!decoded || !decoded.exp) {
          console.warn('isTokenExpired: Token no decodificable o sin fecha de expiración.');
          return true;
        }
    
        const expirationDate = new Date(0); // Época (1 de enero de 1970, 00:00:00 UTC)
        expirationDate.setUTCSeconds(decoded.exp); // Establece la fecha de expiración desde el timestamp Unix
    
        const currentTime = new Date(); // Hora actual
    
        console.log('--- AuthService.isTokenExpired() Check ---'); // Log de depuración
        console.log('  Token Sub (user):', decoded.sub);
        console.log('  Decoded Token Expiration (Unix seconds):', decoded.exp);
        console.log('  Calculated Expiration Date Object:', expirationDate.toISOString());
        console.log('  Current Time Date Object:', currentTime.toISOString());
        const isExpired = expirationDate.valueOf() < currentTime.valueOf(); // Compara en milisegundos
        console.log('  Is Expired (Expiration Date < Current Time):', isExpired);
        console.log('-------------------------------------------');
    
        return isExpired;
    }

    getAccessToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
          const storedToken = localStorage.getItem(this.TOKEN_KEY);
          console.log('AuthService: Recuperando de localStorage -> TOKEN_KEY:', this.TOKEN_KEY, 'Valor:', storedToken ? storedToken.substring(0, 50) + '...' : 'null'); // Log de depuración
          return storedToken;
        }
        return null;
    }

    setUser(user: any) {
        this.cookies.set("userName", user.nombre);
        this.cookies.set("userNumber", user.numEmpleado);
        this.cookies.set("userType", user.type);
        return true;
    }

    getUser(atributo: string) {
        return this.cookies.get(atributo);
    }

    setTipoFiltro(tipo: number) {
        return this.cookies.set("tipoFiltro", tipo.toString());
    }

    getTipoFiltro() {
        return this.cookies.get("tipoFiltro");
    }
}

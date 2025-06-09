import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { ApiService } from "../services/api.service";

@Injectable({
    providedIn: 'root'
})
export class AppGuard implements CanActivate {
    constructor(private apiService: ApiService, private router : Router) {
        
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        let isLoggeIn = this.apiService.getAccessToken();
        // ESTA ES LA LÍNEA CLAVE: Llama a checkAuthStatus() del AuthService
        const isAuthenticated = this.apiService.checkAuthStatus();
        if (!isLoggeIn) {
            this.router.navigate(['/login']);
        } else {
            return true
        }
    }
}
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
        let isLoggeIn = this.apiService.getToken();
        if (!isLoggeIn) {
            this.router.navigate(['/login']);
        } else {
            return true
        }
    }
}
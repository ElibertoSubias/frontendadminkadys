import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(
        private http : HttpClient,
        private cookies : CookieService,
        private router : Router,
    ) {

    }

    login(usuario: any): Observable<any> {
        return this.http.post(`${environment.appBaseUrl}/auth`, usuario);
    }

    logout() {
        this.cookies.delete("token", "/");
        this.cookies.delete("userName", "/");
        this.cookies.delete("userNumber", "/");
        this.cookies.delete("userType", "/");
        this.router.navigate([`/login`]);
        return true;
    }

    setToken(token: any) {
        return this.cookies.set("token", token);
    }

    getToken() {
        return this.cookies.get("token");
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

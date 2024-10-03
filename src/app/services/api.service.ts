import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(
        private http : HttpClient,
        private cookies : CookieService
    ) {

    }

    login(usuario: any): Observable<any> {
        return this.http.post(`${environment.appBaseUrl}/auth`, usuario);
    }

    logout() {
        return this.cookies.delete("token", "/");
    }

    setToken(token: any) {
        return this.cookies.set("token", token);
    }

    getToken() {
        return this.cookies.get("token");
    }
}
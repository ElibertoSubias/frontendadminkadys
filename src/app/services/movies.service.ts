import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

@Injectable({
    providedIn: 'root'
})

export class MoviesService {
    constructor(private http : HttpClient, private cookies : CookieService) {}

    public getNextID(): Observable<any> {
        const token = this.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/dresses/next-id`, {headers});
    }

    public checkCodeAvailable(codigo: number): Observable<any> {
        const token = this.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/dresses/code-valid/${codigo}`, {headers});
    }

    public saveMovie(data: any): Observable<any> {
        const token = this.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.post<any>(`${environment.appBaseUrl}/dresses`, JSON.stringify(data), {headers});
    }

    public saveReservation(data: any): Observable<any> {
        const token = this.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.post<any>(`${environment.appBaseUrl}/reservation`, JSON.stringify(data), {headers});
    }

    public checkDateEvent(fechaEvento: string, id: string, talla: string): Observable<any> {
        const token = this.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/reservation/check-date/${fechaEvento}/dress/${id}/size/${talla}`, {headers});
    }

    public updateMovie(data: any, id: string): Observable<any> {
        const token = this.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.put<any>(`${environment.appBaseUrl}/dresses/${id}`, JSON.stringify(data), {headers});
    }

    public removeMovie(id: string): Observable<any> {
        const token = this.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.delete<any>(`${environment.appBaseUrl}/dresses/${id}`, {headers});
    }

    public uploadImage(file: any, id: string): Observable<any> {
        const token = this.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.post<any>(`${environment.appBaseUrl}/files/${id}`, file, {headers});
    }

    public getAllMovies(): Observable<any> {
        const token = this.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/dresses/all`, { headers });
    }

    public getMoviesByFilter(code: string): Observable<any> {
        const token = this.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/dresses/code/${code}`, { headers });
    }

    public getMovie(id: string): Observable<any> {
        const token = this.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/dresses/${id}`, {headers});
    }

    public getOutForToday(fecha: string): Observable<any> {
        const token = this.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/reservation/outs/by-date?date=${fecha}`, { headers });
    }

    public getEntriesForToday(fecha: string): Observable<any> {
        const token = this.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/reservation/entries/by-date?date=${fecha}`, { headers });
    }

    public getFutureOuts(fecha: string): Observable<any> {
        const token = this.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/reservation/future-outs/by-date?date=${fecha}`, { headers });
    }

    public darSalida(id: string): Observable<any> {
        const token = this.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.put<any>(`${environment.appBaseUrl}/reservation/dar-salida/${id}`, {}, { headers });
    }

    public darEntrada(id: string): Observable<any> {
        const token = this.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.put<any>(`${environment.appBaseUrl}/reservation/dar-entrada/${id}`, {}, { headers });
    }

    public getAllReservatios(): Observable<any> {
        const token = this.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/reservation/all`, { headers });
    }

    setToken(token: any) {
        return this.cookies.set("token", token);
    }

    getToken() {
        return this.cookies.get("token");
    }
}

import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { ApiService } from '../services/api.service';

@Injectable({
    providedIn: 'root'
})

export class MoviesService {
    constructor(private http : HttpClient, private cookies : CookieService, private apiService: ApiService) {}

    public getNextID(): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/dresses/next-id`, {headers});
    }

    public checkCodeAvailable(codigo: number): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/dresses/code-valid/${codigo}`, {headers});
    }

    public saveMovie(data: any): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.post<any>(`${environment.appBaseUrl}/dresses`, JSON.stringify(data), {headers});
    }

    public saveReservation(data: any): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.post<any>(`${environment.appBaseUrl}/reservation`, JSON.stringify(data), {headers});
    }

    public savePortada(data: any): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.post<any>(`${environment.appBaseUrl}/portadas`, JSON.stringify(data), {headers});
    }

    public editReservation(id: string, data: any): Observable<any> {
        data.id = id;
        const token = this.apiService.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.put<any>(`${environment.appBaseUrl}/reservation`, JSON.stringify(data), {headers});
    }

    public checkDateEvent(fechaEvento: string, id: string, talla: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/reservation/check-date/${fechaEvento}/dress/${id}/size/${talla}`, {headers});
    }

    public updateMovie(data: any, id: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.put<any>(`${environment.appBaseUrl}/dresses/${id}`, JSON.stringify(data), {headers});
    }

    public updatePortada(data: any, id: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.put<any>(`${environment.appBaseUrl}/portadas/${id}`, JSON.stringify(data), {headers});
    }

    public changeStatusReservation(id: string, status: boolean): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.put<any>(`${environment.appBaseUrl}/reservation/change-status/${id}`, {"status": status}, { headers });
    }

    public removeMovie(id: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.delete<any>(`${environment.appBaseUrl}/dresses/${id}`, {headers});
    }

    public removePortada(id: string, file: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.delete<any>(`${environment.appBaseUrl}/files/portada/${id}/archivo/${file}`, {headers});
    }

    public uploadImage(file: any, id: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.post<any>(`${environment.appBaseUrl}/files/${id}`, file, {headers});
    }

    public uploadPortada(file: any, id: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.post<any>(`${environment.appBaseUrl}/files/${id}?tipo=portada`, file, {headers});
    }

    public getAllMovies(): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/dresses/all`, { headers });
    }

    public getMoviesByFilter(code: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/dresses/code/${code}`, { headers });
    }

    public getMovie(id: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/dresses/${id}`, {headers});
    }

    public getOutForToday(fecha: string, type: boolean = true): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/reservation/outs/by-date?date=${fecha}&type=${type}`, { headers });
    }

    public getEntriesForToday(fecha: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/reservation/entries/by-date?date=${fecha}`, { headers });
    }

    public getFutureOuts(fecha: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/reservation/future-outs/by-date?date=${fecha}`, { headers });
    }

    public darSalida(id: string, tipoComprobante: number, cantGarantia: number): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.put<any>(`${environment.appBaseUrl}/reservation/dar-salida/${id}`, {tipoComprobante: tipoComprobante, cantGarantia: cantGarantia}, { headers });
    }

    public darEntrada(id: string, dias: number, costoExtra: number): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.put<any>(`${environment.appBaseUrl}/reservation/dar-entrada/${id}/dias/${dias}/costo/${costoExtra}`, {}, { headers });
    }

    public getAllReservatios(): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/reservation/all`, { headers });
    }

    public getTodayReservatios(fecha: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/reservation/today?date=${fecha}`, { headers });
    }

    public getReservation(id: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/reservation/${id}`, { headers });
    }

    public getCorteDiario(fecha: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/reservation/cortediario?date=${fecha}`, { headers });
    }

    public getTopPortadas(): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/portadas/top?limit=10`, { headers });
    }

    public getUsers(): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'x-auth-token': `${token}` };
        return this.http.get<any>(`${environment.appBaseUrl}/users`, { headers });
    }

    public saveUser(data: any): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.post<any>(`${environment.appBaseUrl}/users`, JSON.stringify(data), {headers});
    }

    public editUser(id: string, data: any): Observable<any> {
        data.id = id;
        const token = this.apiService.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.put<any>(`${environment.appBaseUrl}/users`, JSON.stringify(data), {headers});
    }

    public deleteUser(id: string, numEmpleado: string): Observable<any> {
        const token = this.apiService.getToken();
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': `${token}` };
        return this.http.delete<any>(`${environment.appBaseUrl}/users/user/${id}/auth/${numEmpleado}`, {headers});
    }

}

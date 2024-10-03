import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config: any;
    private configUrl: string;

    constructor(private http: HttpClient) {
        this.configUrl = environment.configFile;
    }

    public getJSON(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.http.get(this.configUrl).subscribe({
                next: (cnfg:any) => this.config = cnfg,
                complete: () => resolve(),
            });
        });
    }

    public getConfig(): any {
        return this.config;
    }
    
}
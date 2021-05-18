import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class ApiService {

    constructor(private httpClient: HttpClient) { }
    
    getUsers(): Observable<any> {
        return this.httpClient.get(`${environment.config.bankingBase}/users`);
    }

    sendMoney(request: any): Observable<any> {
        return this.httpClient.post(`${environment.config.bankingBase}/users/send`, request);
    }

    currentUser(): Observable<any> {
        return this.httpClient.get(`${environment.config.bankingBase}/users/current`);
    }
}
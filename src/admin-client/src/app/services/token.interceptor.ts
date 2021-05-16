import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TokenInterceptor {
    constructor(public auth: AuthService) {}
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        return of(this.auth.getToken()).pipe(
            map(token => request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.auth.getToken()}`,
                },
            })),
            switchMap(req => next.handle(req)),
        );
    }
}

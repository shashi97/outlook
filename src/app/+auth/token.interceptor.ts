// src/app/auth/token.interceptor.ts
import { Observable } from 'rxjs/Observable';
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private _authService: AuthService;

    constructor(private injector: Injector) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this._authService = this.injector.get(AuthService);
        let token: string = this._authService.getToken();
        if (token) {
            request = request.clone({
                setHeaders: {
                Authorization: 'Bearer ' + token
                }
            });
        }
        return next.handle(request);
       
    }
}



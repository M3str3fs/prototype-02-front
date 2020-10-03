import { Injectable, NgModule } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppCoreService } from '../services/app-core.service';
import { AppCoreKeys } from '../services/app-core.keys';

@Injectable()
export class HttpRequestAutentiocacaoInterceptor implements HttpInterceptor {
    constructor(
        private appCoreService: AppCoreService
    ) {

    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.appCoreService.isAuthenticated()) {
            const dupReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${this.appCoreService.get(AppCoreKeys.ACCESS_TOKEN)}`),
            });
            return next.handle(dupReq);
        }
        else {
            return next.handle(req);
        }
    }
}
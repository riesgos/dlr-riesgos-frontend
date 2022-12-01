import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from '../configService/configService';


@Injectable()
export class ProxyInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private configService: ConfigService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const originalUrl = req.url;
        const ownUrl = this.router.url;

        if (this.configService.needsProxy(originalUrl)) {
            const proxyReq = req.clone({
                url: this.configService.proxify(originalUrl),
            });
            return next.handle(proxyReq);            
        } else {
            return next.handle(req);
        }
    }
}


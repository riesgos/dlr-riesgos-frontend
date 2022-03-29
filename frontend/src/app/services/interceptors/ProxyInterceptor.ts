import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class ProxyInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const originalUrl = req.url;
        const ownUrl = this.router.url;
        if (originalUrl === ownUrl) {
            return next.handle(req);
        } else {
            const proxyReq = req.clone({
                url: `localhost:8888/proxy/${originalUrl}`,
            });
            return next.handle(proxyReq);
        }

    }

}
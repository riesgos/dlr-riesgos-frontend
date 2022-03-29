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
        if (originalUrl.slice(0, 22) === 'localhost:8888/execute') {
            return next.handle(req);
        } else if (originalUrl.slice(0, 7) !== 'http://' && originalUrl.slice(0, 8) !== 'https://') {
            return next.handle(req);
        } else {
            const proxyReq = req.clone({
                url: `localhost:8888/proxy/${originalUrl}`,
            });
            return next.handle(proxyReq);
        }

    }

}
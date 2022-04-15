import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable()
export class ProxyInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const originalUrl = req.url;
        const ownUrl = this.router.url;

        // no action required if request goes out to middleware
        if (originalUrl.includes(environment.middlewareUrl)) {
            return next.handle(req);
        }
        // no action required if websocket
        else if (originalUrl.slice(0, 5) === 'ws://' || originalUrl.slice(0, 6) !== 'wss://') {
            return next.handle(req);
        } 
        // all other requests: send over proxy
        else {
            const proxyReq = req.clone({
                url: `${environment.proxyUrl}/${originalUrl}`,
            });
            return next.handle(proxyReq);
        }

    }

}
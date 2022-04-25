import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable()
export class ProxyInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!environment.useProxy) return next.handle(req);

        const originalUrl = req.url;
        const ownUrl = this.router.url;

        // only redirect requests that would otherwise cause mixed-content-warnings
        if (originalUrl.slice(0, 7) === 'http://') {
            const proxyReq = req.clone({
                url: `${environment.proxyUrl}/${originalUrl}`,
            });
            return next.handle(proxyReq);            
        } else {
            return next.handle(req);
        }
    }

}
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable()
export class ProxyInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const originalUrl = req.url;
        const ownUrl = this.router.url;

        if (needsProxy(originalUrl)) {
            const proxyReq = req.clone({
                url: `${environment.proxyUrl}/${originalUrl}`,
            });
            return next.handle(proxyReq);            
        } else {
            return next.handle(req);
        }
    }
    
}


// only redirect requests that would otherwise cause mixed-content-warnings
export function needsProxy(targetUrl: string): boolean {
    // if we really want to use a proxy ...
    if (environment.useProxy) {
        // ... and if target-url is of type "http://xxxxxxx:12345" ...
        if (targetUrl.match(/^http:\/\/(\w|-|\.)+:\d+/)) {
            // ... and if it doesn't go to localhost:
            if (!targetUrl.includes('localhost')) {
                return true;
            }
        }
    }
    return false;
}
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
                url: proxify(originalUrl),
            });
            return next.handle(proxyReq);            
        } else {
            return next.handle(req);
        }
    }
    
}


// only redirect requests that would otherwise cause mixed-content-warnings
export function needsProxy(targetUrl: string): boolean {
    if (!environment.useProxy) return false;
    if (targetUrl.includes('localhost')) return false;
    if (targetUrl.includes(window.location.hostname)) return false;
    if (targetUrl.startsWith('https://')) return false;
    if (targetUrl.startsWith('./')) return false;
    return true;
}

export function proxify(targetUrl: string): string {
    if (!needsProxy(targetUrl)) return targetUrl;

    if (targetUrl.match(/^http:\/\/(\w|-|\.)+:\d+/)) {
        return `${environment.fallbackProxyUrl}/${targetUrl}`;
    } else {
        return `${environment.proxyUrl}/${targetUrl}`;
    }

}
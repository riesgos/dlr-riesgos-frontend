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
    if (environment.useProxy) {
        if (targetUrl.includes('localhost')) return false;
        if (targetUrl.includes(window.location.hostname)) return false;
        if (targetUrl.startsWith('https://')) return false;
        if (targetUrl.startsWith('./') || targetUrl.startsWith('/')) return false;
        if (targetUrl.includes('assets/')) return false;
        
        if (targetUrl.startsWith('http://')) return true;
    };
    return false;
}

export function proxify(targetUrl: string): string {
    if (!needsProxy(targetUrl)) return targetUrl;

    const proxyUrl = environment.useFallbackProxy ? environment.fallbackProxyUrl : environment.proxyUrl;

    if (targetUrl.match(/^http:\/\/(\w|-|\.)+:\d+/)) {
        return `${proxyUrl}/${targetUrl}`;
    } else if (targetUrl.includes('91.250.85.221')) {
        return `${proxyUrl}/${targetUrl}`;
    } else {
        return `${environment.proxyUrl}/${targetUrl}`;
    }

}
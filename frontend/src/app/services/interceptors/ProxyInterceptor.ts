import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConfig, APP_CONFIG } from 'src/app/app.module';


@Injectable()
export class ProxyInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        @Inject(APP_CONFIG) private appConfig: AppConfig
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const originalUrl = req.url;
        const ownUrl = this.router.url;

        if (this.needsProxy(originalUrl)) {
            const proxyReq = req.clone({
                url: this.proxify(originalUrl),
            });
            return next.handle(proxyReq);            
        } else {
            return next.handle(req);
        }
    }


    // only redirect requests that would otherwise cause mixed-content-warnings
    public needsProxy(targetUrl: string): boolean {
        if (this.appConfig.useProxy) {
            if (targetUrl.includes('localhost')) return false;
            if (targetUrl.includes(window.location.hostname)) return false;
            if (targetUrl.startsWith('https://')) return false;
            if (targetUrl.startsWith('./') || targetUrl.startsWith('/')) return false;
            if (targetUrl.includes('assets/')) return false;
            
            if (targetUrl.startsWith('http://')) return true;
        };
        return false;
    }

    public proxify(targetUrl: string): string {
        if (!this.needsProxy(targetUrl)) return targetUrl;

        const proxyUrl = this.appConfig.proxyUrl;

        if (targetUrl.match(/^http:\/\/(\w|-|\.)+:\d+/)) {
            return `${proxyUrl}/${targetUrl}`;
        } else if (targetUrl.includes('91.250.85.221')) {
            return `${proxyUrl}/${targetUrl}`;
        } else {
            return `${this.appConfig.proxyUrl}/${targetUrl}`;
        }

    }
    
}


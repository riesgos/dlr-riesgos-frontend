import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";


export interface AppConfig {
    "production": boolean,
    "middlewareUrl": string,
    "useProxy": false,
    "proxyUrl": string,
    "gfzUseStaging": false
  }
  

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private config: AppConfig;

    constructor() {}

    public async loadConfig(): Promise<true> {
        // Must not use angular's http-client.
        // Reason: http-client depends on HTTP_INTERCEPTORS
        // But our ProxyInterceptor depends on ConfigService ...
        // That's a circular dependency.

        console.log("Loading config ...");
        const result = await fetch(`assets/config/config.${environment.type}.json`);
        this.config = await result.json();
        console.log("... got config:", this.config);
        return true;
    }

    public getConfig() {
        return this.config;
    }

    public needsProxy(targetUrl: string): boolean {
        if (this.config.useProxy) {
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

        const proxyUrl = this.config.proxyUrl;

        if (targetUrl.match(/^http:\/\/(\w|-|\.)+:\d+/)) {
            return `${proxyUrl}/${targetUrl}`;
        } else {
            return `${this.config.proxyUrl}/${targetUrl}`;
        }

    }
}
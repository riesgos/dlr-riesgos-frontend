import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";


export interface AppConfig {
    "allowedScenarios": string[],
    "production": boolean,
    "backendUrl": string,
    "proxyUrl": string,
  }
  

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    protected config: AppConfig;

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

}
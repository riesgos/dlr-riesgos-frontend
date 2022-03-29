import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


export interface Config {}

@Injectable()
export class ConfigService {

  private configFile: string;
  private config: Config;
  private id: number;

  constructor(private http: HttpClient) {
    this.configFile = environment.production ? 'assets/config/config.prod.json' : 'assets/config/config.dev.json';
  }

  loadConfig(): Promise<any> {
    console.log('fetching config ...');
    const p = new Promise((resolve, reject) => {
      this.http.get<Config>(this.configFile).subscribe((c: Config) => {
        this.config = c;
        console.log('... fetched config');
        resolve(true);
      });
    });

    return p;
  }

  getConfig(): Config {
    return this.config;
  }
}

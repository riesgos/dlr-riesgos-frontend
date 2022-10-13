import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { AppConfig, APP_CONFIG } from '../app.module';
import { BackendService } from './backend.service';



@Injectable({
  providedIn: 'root'
})
export class AppStateService {


  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private appConfig: AppConfig) { }

}

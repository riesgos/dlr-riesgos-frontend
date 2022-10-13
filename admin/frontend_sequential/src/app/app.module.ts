import { APP_INITIALIZER, Injectable, InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScenarioSelectionComponent } from './pages/scenario-selection/scenario-selection.component';
import { MapComponent } from './pages/map/map.component';
import { AppStateService } from './services/app-state.service';
import { BackendService } from './services/backend.service';



export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export interface AppConfig {
  backendUrl: string
}


@NgModule({
  declarations: [
    AppComponent,
    ScenarioSelectionComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    AppStateService,
    // {
    //   multi: true,
    //   provide: APP_INITIALIZER,
    //   deps: [AppStateService],
    //   useFactory: (appStateSvc: AppStateService) => {
    //     return () => appStateSvc.init();
    //   },
    // },
    {
      multi: true,
      provide: APP_CONFIG,
      deps: [HttpClient],
      useFactory: (http: HttpClient) => {
        return () => {
          return http.get<AppConfig>('assets/config.json');
        }
      }

    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


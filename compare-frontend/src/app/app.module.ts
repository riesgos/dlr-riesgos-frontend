import { environment } from 'src/environments/environment';

import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapModule } from './modules/map/map.module';
import { WikiModule } from './modules/wiki/wiki.module';
import { WizardModule } from './modules/wizard/wizard.module';
import { ConfigService } from './services/config.service';
import { Effects } from './state/effects';
import { reducer } from './state/reducer';
import { StartpageComponent } from './views/startpage/startpage.component';
import { MappageComponent } from './views/mappage/mappage.component';
import { UtilsModule } from './modules/utils/utils.module';

@NgModule({
  declarations: [
    AppComponent,
    StartpageComponent,
    MappageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    UtilsModule,
    MapModule,
    WizardModule,
    WikiModule,
    StoreModule.forRoot({ riesgos: reducer }, {}),
    EffectsModule.forRoot([Effects]),
    environment.type !== 'prod' ? StoreDevtoolsModule.instrument({
      maxAge: 25,
    }) : [],
  ],
  providers: [{
    multi: true,
    provide: APP_INITIALIZER,
    deps: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return () => configService.loadConfig();
    }
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

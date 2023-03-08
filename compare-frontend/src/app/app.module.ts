import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { WizardComponent } from './components/wizard/wizard.component';
import { StepComponent } from './components/wizard/step/step.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducer } from './state/reducer';
import { Effects } from './state/effects';
import { HttpClientModule } from '@angular/common/http';
import { StartpageComponent } from './views/startpage/startpage.component';
import { MappageComponent } from './views/mappage/mappage.component';
import { environment } from 'src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { ConfigService } from './services/config.service';
import { RiesgosState } from './state/state';
import { CollapsableComponent } from './components/collapsable/collapsable.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { TabComponent } from './components/tabs/tab.component';
import { ConfigComponent } from './components/wizard/step/config/config.component';
import { LayersComponent } from './components/wizard/step/layers/layers.component';



@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    WizardComponent,
    StepComponent,
    StartpageComponent,
    MappageComponent,
    CollapsableComponent,
    TabsComponent,
    TabComponent,
    ConfigComponent,
    LayersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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

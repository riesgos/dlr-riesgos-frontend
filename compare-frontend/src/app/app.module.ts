import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    WizardComponent,
    StepComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({ app: reducer }, {}),
    EffectsModule.forRoot([Effects])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

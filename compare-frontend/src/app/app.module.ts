import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { WizardComponent } from './components/wizard/wizard.component';
import { StepComponent } from './components/wizard/step/step.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    WizardComponent,
    StepComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

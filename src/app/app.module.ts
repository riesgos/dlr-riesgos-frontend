import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { reducers, effects } from './ngrx_register';
import { EffectsModule } from '@ngrx/effects';
import { GlobalAlertComponent } from './components/global-alert/global-alert.component';
import { GlobalFooterComponent } from './components/global-footer/global-footer.component';
import { GlobalProgressComponent } from './components/global-progress/global-progress.component';
import { HeaderComponent } from './components/header/header.component';
import { SaveButtonComponent } from './components/save-button/save-button.component';
import { ProgressService } from './components/global-progress/progress.service';
import { FooterService } from './components/global-footer/footer.service';
import { AlertService } from './components/global-alert/alert.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfigurationControlModule } from 'projects/configuration-control/src/public_api';
import { FeatureTablesModule } from 'projects/feature-tables/src/public_api';
import { WpsWorkflowControl } from './wps/control/wpsWorkflowControl';
import { WpsClient } from 'projects/services-wps/src/public_api';
import { ConfigurationWizzardComponent } from './components/configuration-wizzard/configuration-wizzard.component';
import { WizzardPageComponent } from './components/wizzard-page/wizzard-page.component';
import { SelectFieldComponent } from './components/select-field/select-field.component';
import { LiteralFieldComponent } from './components/literal-field/literal-field.component';
import { BboxFieldComponent } from './components/bbox-field/bbox-field.component';

@NgModule({
  declarations: [
    AppComponent, 
    GlobalAlertComponent, 
    GlobalFooterComponent, 
    GlobalProgressComponent, 
    HeaderComponent,
    SaveButtonComponent,
    ConfigurationWizzardComponent,
    WizzardPageComponent,
    SelectFieldComponent,
    LiteralFieldComponent,
    BboxFieldComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects), 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ConfigurationControlModule,
    FeatureTablesModule
  ],
  providers: [AlertService, FooterService, ProgressService, WpsWorkflowControl, WpsClient],
  bootstrap: [AppComponent]
})
export class AppModule { }

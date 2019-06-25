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
import { ConfigurationWizardComponent } from './components/config_wizard/configuration-wizard/configuration-wizard.component';
import { FormComponent } from './components/config_wizard/form/form.component';
import { FormSelectFieldComponent } from './components/config_wizard/form-select-field/form-select-field.component';
import { FormStringFieldComponent } from './components/config_wizard/form-string-field/form-string-field.component';
import { WizardPageComponent } from './components/config_wizard/wizard-page/wizard-page.component';
import { FeatureTablesModule } from 'projects/feature-tables/src/public_api';
import { WorkflowControl } from './wps/control/workflowcontrol';
import { WpsConfigurationProvider } from './wps/configuration/configurationProvider';

@NgModule({
  declarations: [
    AppComponent, 
    GlobalAlertComponent, 
    GlobalFooterComponent, 
    GlobalProgressComponent, 
    HeaderComponent,
    SaveButtonComponent, 
    ConfigurationWizardComponent, 
    FormComponent, 
    FormSelectFieldComponent, 
    FormStringFieldComponent, 
    WizardPageComponent
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
    FeatureTablesModule
  ],
  providers: [AlertService, FooterService, ProgressService, WorkflowControl, WpsConfigurationProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }

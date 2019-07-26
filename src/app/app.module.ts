import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { UkisRoutingModule } from './app-routing.module';
import { UkisComponent } from './app.component';
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
import { FormFeatureSelectFieldComponent } from './components/config_wizard/form-featureselect-field/form-featureselect-field.component';
import { FormStringFieldComponent } from './components/config_wizard/form-string-field/form-string-field.component';
import { WizardPageComponent } from './components/config_wizard/wizard-page/wizard-page.component';
import { FeatureTablesModule } from 'projects/feature-tables/src/public_api';
import { ScenariosComponent } from './route-components/scenarios/scenarios.component';
import { RouteMapComponent } from './route-components/route-map/route-map.component';
import { MapOlModule } from '@ukis/map-ol';
import { LayersModule } from '@ukis/services-layers';
import { LayerControlModule } from '@ukis/layer-control';
import { MapComponent } from './components/map/map.component';
import { LayercontrolComponent } from './components/layercontrol/layercontrol.component';
import { FormBboxFieldComponent } from './components/config_wizard/form-bbox-field/form-bbox-field.component';
import { VarDirective } from './ng-var.directive';
import { LayerMarshaller } from './components/map/layer_marshaller';
import { ScreenshotComponent } from './components/screenshot/screenshot.component';
import { FormStringselectFieldComponent } from './components/config_wizard/form-stringselect-field/form-stringselect-field.component';

@NgModule({
  declarations: [
    UkisComponent, 
    GlobalAlertComponent, 
    GlobalFooterComponent, 
    GlobalProgressComponent, 
    HeaderComponent,
    SaveButtonComponent, 
    ConfigurationWizardComponent, 
    FormComponent, 
    FormFeatureSelectFieldComponent, 
    FormStringFieldComponent, 
    WizardPageComponent, 
    ScenariosComponent, 
    RouteMapComponent, 
    MapComponent, 
    LayercontrolComponent, 
    FormBboxFieldComponent, 
    VarDirective, ScreenshotComponent, FormStringselectFieldComponent
  ],
  imports: [
    BrowserModule,
    UkisRoutingModule,
    MapOlModule,
    LayersModule,
    LayerControlModule, 
    ClarityModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects), 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FeatureTablesModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [
    AlertService, FooterService, ProgressService, LayerMarshaller
  ],
  bootstrap: [UkisComponent]
})
export class AppModule { }

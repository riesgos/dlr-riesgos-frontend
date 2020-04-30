import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { UkisRoutingModule } from './app-routing.module';
import { UkisComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { reducers, effects, State } from './ngrx_register';
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
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfigurationWizardComponent } from './components/config_wizard/configuration-wizard/configuration-wizard.component';
import { FormComponent } from './components/config_wizard/form/form.component';
import { FormFeatureSelectFieldComponent } from './components/config_wizard/form-featureselect-field/form-featureselect-field.component';
import { FormStringFieldComponent } from './components/config_wizard/form-string-field/form-string-field.component';
import { WizardPageComponent } from './components/config_wizard/wizard-page/wizard-page.component';
import { ScenariosComponent } from './route-components/scenarios/scenarios.component';
import { RouteMapComponent } from './route-components/route-map/route-map.component';
import { MapOlModule, MapOlService } from '@dlr-eoc/map-ol';
import { LayersModule, LayersService } from '@dlr-eoc/services-layers';
import { MapComponent } from './components/map/map.component';
import { LayercontrolComponent } from './components/layercontrol/layercontrol.component';
import { FormBboxFieldComponent } from './components/config_wizard/form-bbox-field/form-bbox-field.component';
import { VarDirective } from './ng-var.directive';
import { LayerMarshaller } from './components/map/layer_marshaller';
import { ScreenshotComponent } from './components/screenshot/screenshot.component';
import { FormStringselectFieldComponent } from './components/config_wizard/form-stringselect-field/form-stringselect-field.component';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { GraphvizcompComponent } from './components/graphvizcomp/graphvizcomp.component';
import { ShowgraphComponent } from './components/showgraph/showgraph.component';
import { BboxfieldComponent } from './components/config_wizard/form-bbox-field/bboxfield/bboxfield.component';
import { RouteDocumentationComponent } from './route-components/route-documentation/route-documentation.component';
import { ReadMoreComponent } from './components/read-more/read-more.component';
import { Action } from '@ngrx/store';
import { TextModalComponent } from './components/text-modal/text-modal.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { DisclaimerpopupComponent } from './components/disclaimerpopup/disclaimerpopup.component';
import { InteractionstatemonitorComponent } from './components/interactionstatemonitor/interactionstatemonitor.component';
import { LicensesComponent } from './route-components/licenses/licenses.component';
import { BlogentryComponent } from './components/blogentry/blogentry.component';
import { DndDirective } from './components/save-button/dnd/dnd.directive';
import { LayerControlComponent } from './components/layer_control/layer-control/layer-control.component';
import { BaseLayerControlComponent } from './components/layer_control/base-layer-control/base-layer-control.component';
import { LayerentryComponent } from './components/layer_control/layerentry/layerentry.component';
import { LayerentryGroupComponent } from './components/layer_control/layerentry-group/layerentry-group.component';
import { VectorLegendComponent } from './components/layer_control/vector-legend/vector-legend.component';
import { ReversePipe } from './components/layer_control/utils/array-reverse.pipe';
import { RegexTranslatePipe } from './helpers/regex-translate.pipe';
import { ConfigService, Config } from './services/config.service';
import { RiesgosService } from './riesgos/riesgos.service';

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
    VarDirective,
    ScreenshotComponent,
    FormStringselectFieldComponent,
    LanguageSwitcherComponent,
    GraphvizcompComponent,
    ShowgraphComponent,
    BboxfieldComponent,
    RouteDocumentationComponent,
    ReadMoreComponent,
    TextModalComponent,
    DisclaimerComponent,
    DisclaimerpopupComponent,
    InteractionstatemonitorComponent,
    LicensesComponent,
    BlogentryComponent,
    DndDirective,
    LayerControlComponent, BaseLayerControlComponent, LayerentryComponent,
    LayerentryGroupComponent, VectorLegendComponent, ReversePipe, RegexTranslatePipe
  ],
  imports: [
    BrowserModule,
    UkisRoutingModule,
    MapOlModule,
    LayersModule,
    ClarityModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
        strictStateSerializability: false,
        strictActionSerializability: false,
      },
    }),
    EffectsModule.forRoot(effects),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/translations/', '.json'),
        deps: [HttpClient]
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 10 }) : []
  ],
  providers: [
    AlertService,
    FooterService,
    ProgressService,
    RiesgosService,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (cs: ConfigService) => {
        return () => cs.loadConfig();
      },
      multi: true,
      deps: [ConfigService]
    },
  ],
  bootstrap: [UkisComponent]
})
export class AppModule { }

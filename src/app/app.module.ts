import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { UkisRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { MapOlModule } from '@dlr-eoc/map-ol';
import { LayersModule } from '@dlr-eoc/services-layers';
import { Ng5SliderModule } from 'ng5-slider';

import { GlobalAlertComponent } from './components/global-alert/global-alert.component';
import { GlobalFooterComponent } from './components/global-footer/global-footer.component';
import { GlobalProgressComponent } from './components/global-progress/global-progress.component';
import { HeaderComponent } from './components/header/header.component';
import { SaveButtonComponent } from './components/save-button/save-button.component';
import { ConfigurationWizardComponent } from './components/config_wizard/configuration-wizard/configuration-wizard.component';
import { FormComponent } from './components/config_wizard/form/form.component';
import { FormFeatureSelectFieldComponent } from './components/config_wizard/form-featureselect-field/form-featureselect-field.component';
import { FormStringFieldComponent } from './components/config_wizard/form-string-field/form-string-field.component';
import { WizardPageComponent } from './components/config_wizard/wizard-page/wizard-page.component';
import { ScenariosComponent } from './views/scenarios/scenarios.component';
import { RouteMapComponent } from './views/route-map/route-map.component';
import { MapComponent } from './components/map/map.component';
import { LayercontrolComponent } from './components/layercontrol/layercontrol.component';
import { FormBboxFieldComponent } from './components/config_wizard/form-bbox-field/form-bbox-field.component';
import { ScreenshotComponent } from './components/screenshot/screenshot.component';
import { FormStringselectFieldComponent } from './components/config_wizard/form-stringselect-field/form-stringselect-field.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { GraphvizcompComponent } from './components/graphvizcomp/graphvizcomp.component';
import { ShowgraphComponent } from './components/showgraph/showgraph.component';
import { BboxfieldComponent } from './components/config_wizard/form-bbox-field/bboxfield/bboxfield.component';
import { RouteDocumentationComponent } from './views/route-documentation/route-documentation.component';
import { ReadMoreComponent } from './components/read-more/read-more.component';
import { TextModalComponent } from './components/text-modal/text-modal.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { DisclaimerpopupComponent } from './components/disclaimerpopup/disclaimerpopup.component';
import { InteractionstatemonitorComponent } from './components/interactionstatemonitor/interactionstatemonitor.component';
import { LicensesComponent } from './views/licenses/licenses.component';
import { BlogentryComponent } from './components/blogentry/blogentry.component';
import { RiesgosLayerControlComponent } from './components/riesgos_layer_control/layer-control/layer-control.component';
import { BaseLayerControlComponent } from './components/riesgos_layer_control/base-layer-control/base-layer-control.component';
import { RiesgosLayerentryComponent } from './components/riesgos_layer_control/layerentry/layerentry.component';
import { LayerentryGroupComponent } from './components/riesgos_layer_control/layerentry-group/layerentry-group.component';
import { VectorLegendComponent } from './components/dynamic/vector-legend/vector-legend.component';
import { CanvasComponent } from './components/dynamic/vector-legend/canvas/canvas.component';
import { ChangedetectorComponent } from './components/changedetector/changedetector.component';
import { BlinkerComponent } from './components/changedetector/blinker/blinker.component';
import { FpserComponent } from './components/changedetector/fpser/fpser.component';
import { ThemePickerComponent } from './components/theme-picker/theme-picker.component';
import { PrintComponent } from './components/print/print.component';
import { PrintMapComponent } from './components/print/print-map/print-map.component';
import { ScalerComponent } from './components/scaler/scaler.component';
import { GroupSliderComponent } from './components/dynamic/group-slider/group-slider.component';
import { DynamicComponentComponent, ViewRefDirective } from './components/dynamic-component/dynamic-component.component';
import { InfoTableComponentComponent } from './components/dynamic/info-table-component/info-table-component.component';

import { ConfigService } from './services/config/config.service';
import { RiesgosService } from './riesgos/riesgos.service';
import { ProgressService } from './components/global-progress/progress.service';
import { FooterService } from './components/global-footer/footer.service';
import { AlertService } from './components/global-alert/alert.service';

import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { VarDirective } from './ng-var.directive';
import { DndDirective } from './components/save-button/dnd/dnd.directive';
import { RegexTranslatePipe } from './helpers/regex-translate.pipe';
import { ReversePipe } from './components/riesgos_layer_control/utils/array-reverse.pipe';
import { WMTSLayerFactory } from './components/map/wmts';
import { reducers, effects } from './ngrx_register';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { environment } from '../environments/environment';
import { TranslatableStringComponent } from './components/dynamic/translatable-string/translatable-string.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

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
    RiesgosLayerControlComponent,
    BaseLayerControlComponent,
    RiesgosLayerentryComponent,
    LayerentryGroupComponent,
    VectorLegendComponent,
    CanvasComponent,
    ReversePipe,
    RegexTranslatePipe,
    ChangedetectorComponent,
    BlinkerComponent,
    FpserComponent,
    ThemePickerComponent,
    PrintComponent,
    PrintMapComponent,
    ScalerComponent,
    GroupSliderComponent,
    DynamicComponentComponent,
    ViewRefDirective,
    InfoTableComponentComponent,
    TranslatableStringComponent
  ],
  imports: [
    BrowserModule,
    UkisRoutingModule,
    MapOlModule,
    LayersModule,
    ClarityModule,
    BrowserAnimationsModule,
    PerfectScrollbarModule,
    Ng5SliderModule,
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
    // !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 2 }) : []
  ],
  providers: [
    AlertService,
    FooterService,
    ProgressService,
    RiesgosService,
    ConfigService,
    WMTSLayerFactory,
    {
      provide: APP_INITIALIZER,
      useFactory: (cs: ConfigService) => {
        return () => cs.loadConfig();
      },
      multi: true,
      deps: [ConfigService]
    }, {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

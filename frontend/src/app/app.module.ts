import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { UkisRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { MapOlModule } from '@dlr-eoc/map-ol';
import { CoreUiModule } from '@dlr-eoc/core-ui';
import { LayersModule } from '@dlr-eoc/services-layers';
import { Ng5SliderModule } from 'ng5-slider';

import { GlobalAlertComponent } from './components/global-alert/global-alert.component';
import { GlobalFooterComponent } from './components/global-footer/global-footer.component';
import { GlobalProgressComponent } from './components/global-progress/global-progress.component';
import { HeaderComponent } from './components/header/header.component';
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
import { ThemePickerComponent } from './components/theme-picker/theme-picker.component';
import { GroupSliderComponent } from './components/dynamic/group-slider/group-slider.component';
import { InfoTableComponentComponent } from './components/dynamic/info-table-component/info-table-component.component';
import { HelperButtonsComponent } from './components/helperButtons/helper-buttons.component';

import { RiesgosService } from './riesgos/riesgos.service';
import { ProgressService } from './components/global-progress/progress.service';
import { FooterService } from './components/global-footer/footer.service';
import { AlertService } from './components/global-alert/alert.service';

import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { VarDirective } from './ng-var.directive';
import { DndDirective } from './components/helperButtons/dnd/dnd.directive';
import { RegexTranslatePipe } from './services/simplifiedTranslation/regex-translate.pipe';
import { SimpleTranslatePipe } from './services/simplifiedTranslation/simple-translate.pipe';
import { ReversePipe } from './components/riesgos_layer_control/utils/array-reverse.pipe';
import { WMTSLayerFactory } from './mappable/wmts';
import { reducers, effects } from './ngrx_register';

import { environment } from '../environments/environment';
import { TranslatableStringComponent } from './components/dynamic/translatable-string/translatable-string.component';
import { VerticalNavResizeComponent } from './components/vertical-nav-resize/vertical-nav-resize.component';
import { NavResizeDirectiveDirective } from './directives/nav-resize-directive/nav-resize-directive.directive';

// import all used icons
import { coreCollectionIcons, essentialCollectionIcons, ClarityIcons, travelCollectionIcons } from '@cds/core/icon';
import { DisclaimerTriggerComponent } from './components/disclaimer-trigger/disclaimer-trigger.component';
import { DisclaimerService } from './components/disclaimer/disclaimer.service';
import { ProxyInterceptor } from './services/interceptors/ProxyInterceptor';
import { DamagePopupComponent } from './components/dynamic/damage-popup/damage-popup.component';
import { GroupedBarChartComponent } from './components/grouped-bar-chart/grouped-bar-chart.component';
import { EconomicDamagePopupComponent } from './components/dynamic/economic-damage-popup/economic-damage-popup.component';
// loading an icon from the "core set" now must be done manually
ClarityIcons.addIcons(...[...coreCollectionIcons, ...essentialCollectionIcons, ...travelCollectionIcons]);



@NgModule({
  declarations: [
    AppComponent,
    GlobalAlertComponent,
    GlobalFooterComponent,
    GlobalProgressComponent,
    HeaderComponent,
    HelperButtonsComponent,
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
    SimpleTranslatePipe,
    ThemePickerComponent,
    GroupSliderComponent,
    InfoTableComponentComponent,
    TranslatableStringComponent,
    VerticalNavResizeComponent,
    NavResizeDirectiveDirective,
    DisclaimerTriggerComponent,
    DamagePopupComponent,
    GroupedBarChartComponent,
    EconomicDamagePopupComponent
  ],
  imports: [
    BrowserModule,
    UkisRoutingModule,
    CoreUiModule,
    MapOlModule,
    LayersModule,
    ClarityModule,
    BrowserAnimationsModule,
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
    // !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 3 }) : []
    []
  ],
  providers: [
    AlertService,
    DisclaimerService,
    FooterService,
    ProgressService,
    RiesgosService,
    WMTSLayerFactory, {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: ProxyInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

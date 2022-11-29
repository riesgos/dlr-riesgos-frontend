import { environment } from '../environments/environment';

// modules
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ClarityModule } from '@clr/angular';
import { CoreUiModule } from '@dlr-eoc/core-ui';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LayersModule } from '@dlr-eoc/services-layers';
import { MapOlModule } from '@dlr-eoc/map-ol';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { UkisRoutingModule } from './app-routing.module';

// components
import { BaseLayerControlComponent } from './components/riesgos_layer_control/base-layer-control/base-layer-control.component';
import { BboxfieldComponent } from './components/config_wizard/form-bbox-field/bboxfield/bboxfield.component';
import { BlogentryComponent } from './components/blogentry/blogentry.component';
import { CanvasComponent } from './components/dynamic/vector-legend/canvas/canvas.component';
import { ConfigurationWizardComponent } from './components/config_wizard/configuration-wizard/configuration-wizard.component';
import { DamagePopupComponent } from './components/dynamic/damage-popup/damage-popup.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { DisclaimerpopupComponent } from './components/disclaimerpopup/disclaimerpopup.component';
import { DisclaimerTriggerComponent } from './components/disclaimer-trigger/disclaimer-trigger.component';
import { EconomicDamagePopupComponent } from './components/dynamic/economic-damage-popup/economic-damage-popup.component';
import { FormBboxFieldComponent } from './components/config_wizard/form-bbox-field/form-bbox-field.component';
import { FormComponent } from './components/config_wizard/form/form.component';
import { FormFeatureSelectFieldComponent } from './components/config_wizard/form-featureselect-field/form-featureselect-field.component';
import { FormStringFieldComponent } from './components/config_wizard/form-string-field/form-string-field.component';
import { FormStringselectFieldComponent } from './components/config_wizard/form-stringselect-field/form-stringselect-field.component';
import { GlobalAlertComponent } from './components/global-alert/global-alert.component';
import { GlobalProgressComponent } from './components/global-progress/global-progress.component';
import { GroupedBarChartComponent } from './components/grouped-bar-chart/grouped-bar-chart.component';
import { HeaderComponent } from './components/header/header.component';
import { HelperButtonsComponent } from './components/helperButtons/helper-buttons.component';
import { InfoTableComponentComponent } from './components/dynamic/info-table-component/info-table-component.component';
import { InteractionstatemonitorComponent } from './components/interactionstatemonitor/interactionstatemonitor.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { LayercontrolComponent } from './components/layercontrol/layercontrol.component';
import { LayerentryGroupComponent } from './components/riesgos_layer_control/layerentry-group/layerentry-group.component';
import { LicensesComponent } from './views/licenses/licenses.component';
import { MapComponent } from './components/map/map.component';
import { ReadMoreComponent } from './components/read-more/read-more.component';
import { RiesgosLayerControlComponent } from './components/riesgos_layer_control/layer-control/layer-control.component';
import { RiesgosLayerentryComponent } from './components/riesgos_layer_control/layerentry/layerentry.component';
import { RouteDocumentationComponent } from './views/route-documentation/route-documentation.component';
import { RouteMapComponent } from './views/route-map/route-map.component';
import { ScenariosComponent } from './views/scenarios/scenarios.component';
import { TextModalComponent } from './components/text-modal/text-modal.component';
import { ThemePickerComponent } from './components/theme-picker/theme-picker.component';
import { TranslatableStringComponent } from './components/dynamic/translatable-string/translatable-string.component';
import { VectorLegendComponent } from './components/dynamic/vector-legend/vector-legend.component';
import { VerticalNavResizeComponent } from './components/vertical-nav-resize/vertical-nav-resize.component';
import { WizardPageComponent } from './components/config_wizard/wizard-page/wizard-page.component';

// services
import { AlertService } from './components/global-alert/alert.service';
import { BackendService } from './services/backend/backend.service';
import { ConfigService } from './services/configService/configService';
import { ProgressService } from './components/global-progress/progress.service';
import { DisclaimerService } from './components/disclaimer/disclaimer.service';

// other
import { DndDirective } from './components/helperButtons/dnd/dnd.directive';
import { NavResizeDirectiveDirective } from './directives/nav-resize-directive/nav-resize-directive.directive';
import { ProxyInterceptor } from './services/interceptors/ProxyInterceptor';
import { reducers, effects } from './ngrx_register';
import { RegexTranslatePipe } from './services/simplifiedTranslation/regex-translate.pipe';
import { ReversePipe } from './components/riesgos_layer_control/utils/array-reverse.pipe';
import { SimpleTranslatePipe } from './services/simplifiedTranslation/simple-translate.pipe';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { WMTSLayerFactory } from './components/map/mappable/wmts';

// import all used icons
import { coreCollectionIcons, essentialCollectionIcons, ClarityIcons, travelCollectionIcons } from '@cds/core/icon';
import { DataService } from './services/data/data.service';
import { TranslatedImageComponent } from './components/dynamic/translated-image/translated-image.component';
import { GroupSliderComponent } from './components/dynamic/group-slider/group-slider.component';
import { LegendComponent } from './components/dynamic/legend/legend.component';
// loading an icon from the "core set" now must be done manually
ClarityIcons.addIcons(...[...coreCollectionIcons, ...essentialCollectionIcons, ...travelCollectionIcons]);







@NgModule({
  declarations: [
    AppComponent,
    BaseLayerControlComponent,
    BboxfieldComponent,
    BlogentryComponent,
    CanvasComponent,
    ConfigurationWizardComponent,
    DamagePopupComponent,
    DisclaimerComponent,
    DisclaimerpopupComponent,
    DisclaimerTriggerComponent,
    DndDirective,
    EconomicDamagePopupComponent,
    FormBboxFieldComponent,
    FormComponent,
    FormFeatureSelectFieldComponent,
    FormStringFieldComponent,
    FormStringselectFieldComponent,
    GlobalAlertComponent,
    GlobalProgressComponent,
    GroupedBarChartComponent,
    HeaderComponent,
    HelperButtonsComponent,
    InfoTableComponentComponent,
    InteractionstatemonitorComponent,
    LanguageSwitcherComponent,
    LayercontrolComponent,
    LayerentryGroupComponent,
    LicensesComponent,
    MapComponent,
    NavResizeDirectiveDirective,
    ReadMoreComponent,
    RegexTranslatePipe,
    ReversePipe,
    RiesgosLayerControlComponent,
    RiesgosLayerentryComponent,
    RouteDocumentationComponent,
    RouteMapComponent,
    ScenariosComponent,
    SimpleTranslatePipe,
    TextModalComponent,
    ThemePickerComponent,
    TranslatableStringComponent,
    VectorLegendComponent,
    VerticalNavResizeComponent,
    WizardPageComponent,
    TranslatedImageComponent,
    GroupSliderComponent,
    LegendComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ClarityModule,
    CoreUiModule,
    FormsModule,
    HttpClientModule,
    LayersModule,
    MapOlModule,
    ReactiveFormsModule,
    UkisRoutingModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
    !environment.production ? StoreDevtoolsModule.instrument({
      maxAge: 25,
    }) : [],
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/translations/', '.json'),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      multi: true,
      provide: APP_INITIALIZER,
      deps: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return () => configService.loadConfig();
      }
    }, {
      multi: true,
      provide: HTTP_INTERCEPTORS,
      useClass: ProxyInterceptor
    },
    AlertService,
    DisclaimerService,
    ProgressService,
    WMTSLayerFactory,
    BackendService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { environment } from 'src/environments/environment';

import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConverterService, converterToken as mapConverterToken, DefaultConverter } from './modules/map/converter.service';
import { EqSelection } from './modules/map/converters/eqts/1_eqselect';
import { EqSimulation } from './modules/map/converters/eqts/2_eqsim';
import { Exposure } from './modules/map/converters/eqts/3_exposure';
import { EqDmg } from './modules/map/converters/eqts/4_eq_dmg';
import { TsSim } from './modules/map/converters/eqts/5_tssim';
import { TSDmg } from './modules/map/converters/eqts/6_ts_dmg';
import { SysRel } from './modules/map/converters/eqts/7_sysrel';
import { MapService } from './modules/map/map.service';
import { MapComponent } from './modules/map/map/map.component';
import { BarchartComponent } from './modules/map/popups/barchart/barchart.component';
import { DamagePopupComponent } from './modules/map/popups/damage-popup/damage-popup.component';
import { GroupedBarChartComponent } from './modules/map/popups/grouped-bar-chart/grouped-bar-chart.component';
import { LinkPopupComponent } from './modules/map/popups/link-popup/link-popup.component';
import { StringPopupComponent } from './modules/map/popups/string-popup/string-popup.component';
import { UtilsModule } from './modules/utils/utils.module';
import { ConverterService as WizardConverterService, converterToken as wizardConverterToken, DefaultConverter as WizardDefaultConverter } from './modules/wizard/converter.service';
import { CollapsableComponent } from './modules/wizard/collapsable/collapsable.component';
import { EqSelection as WizardEqSelection } from './modules/wizard/converters/eqts/1_eqselect';
import { EqSimulation as WizardEqSimulation } from './modules/wizard/converters/eqts/2_eqsim';
import { Exposure as WizardExposure } from './modules/wizard/converters/eqts/3_exposure';
import { EqDmg as WizardEqDmg } from './modules/wizard/converters/eqts/4_eq_dmg';
import { TsSim as WizardTsSim } from './modules/wizard/converters/eqts/5_tssim';
import { TsDmg as WizardTsDmg } from './modules/wizard/converters/eqts/6_ts_dmg';
import { SysRel as WizardSysRel } from './modules/wizard/converters/eqts/7_sysrel';
import { DescriptionComponent } from './modules/wizard/tabComponents/description/description.component';
import { DownloadComponent } from './modules/wizard/tabComponents/download/download.component';
import { ErrorComponent } from './modules/wizard/tabComponents/error/error.component';
import { LayerComponent } from './modules/wizard/tabComponents/layers/layer/layer.component';
import { LayersComponent } from './modules/wizard/tabComponents/layers/layers.component';
import { CircleLegendComponent } from './modules/wizard/tabComponents/legends/legendComponents/circle-legend/circle-legend.component';
import { LegendComponent } from './modules/wizard/tabComponents/legends/legendComponents/legend/legend.component';
import { MultiLegendComponent } from './modules/wizard/tabComponents/legends/legendComponents/multi-legend/multi-legend.component';
import { LegendsComponent } from './modules/wizard/tabComponents/legends/legends.component';
import { TranslatedImageComponent } from './modules/wizard/tabComponents/legends/translated-image/translated-image.component';
import { TabComponent } from './modules/wizard/tabs/tab.component';
import { TabsComponent } from './modules/wizard/tabs/tabs.component';
import { WizardService } from './modules/wizard/wizard.service';
import { InfoComponent } from './modules/wizard/wizard/info/info.component';
import { ConfigComponent } from './modules/wizard/wizard/step/config/config.component';
import { StepComponent } from './modules/wizard/wizard/step/step.component';
import { WizardComponent } from './modules/wizard/wizard/wizard.component';
import { ConfigService } from './services/config.service';
import { Effects } from './state/effects';
import { reducer } from './state/reducer';
import { ImpressumComponent } from './views/impressum/impressum.component';
import { MappageComponent } from './views/mappage/mappage.component';
import { ModalComponent } from './views/mappage/modal/modal.component';
import { StartpageComponent } from './views/startpage/startpage.component';

@NgModule({
  declarations: [
    AppComponent,
    StartpageComponent,
    MappageComponent,
    ModalComponent,
    ImpressumComponent,
    MapComponent,
    StringPopupComponent,
    BarchartComponent,
    GroupedBarChartComponent,
    DamagePopupComponent,
    LinkPopupComponent,
    CollapsableComponent,
    WizardComponent,
    StepComponent,
    ConfigComponent,
    TabsComponent,
    TabComponent,
    LayersComponent,
    MultiLegendComponent,
    LegendComponent,
    CircleLegendComponent,
    DescriptionComponent,
    DownloadComponent,
    LegendsComponent,
    ErrorComponent,
    LayerComponent,
    TranslatedImageComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    UtilsModule,
    CommonModule,
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
    },
    MapService,
    ConverterService,
    { provide: mapConverterToken, useClass: EqSelection, multi: true },
    { provide: mapConverterToken, useClass: EqSimulation, multi: true },
    { provide: mapConverterToken, useClass: Exposure, multi: true },
    { provide: mapConverterToken, useClass: EqDmg, multi: true },
    { provide: mapConverterToken, useClass: TsSim, multi: true },
    { provide: mapConverterToken, useClass: TSDmg, multi: true },
    { provide: mapConverterToken, useClass: SysRel, multi: true },
    { provide: mapConverterToken, useClass: DefaultConverter, multi: true },
    WizardService,
    WizardConverterService,
    { provide: wizardConverterToken, useClass: WizardEqSelection, multi: true },
    { provide: wizardConverterToken, useClass: WizardEqSimulation, multi: true },
    { provide: wizardConverterToken, useClass: WizardExposure, multi: true },
    { provide: wizardConverterToken, useClass: WizardEqDmg, multi: true },
    { provide: wizardConverterToken, useClass: WizardTsSim, multi: true },
    { provide: wizardConverterToken, useClass: WizardTsDmg, multi: true },
    { provide: wizardConverterToken, useClass: WizardSysRel, multi: true },
    { provide: wizardConverterToken, useClass: WizardDefaultConverter, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

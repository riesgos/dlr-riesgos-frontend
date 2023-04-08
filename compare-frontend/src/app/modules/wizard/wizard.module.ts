import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CollapsableComponent } from './collapsable/collapsable.component';
import { TabComponent } from './tabs/tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { ConfigComponent } from './wizard/step/config/config.component';
import { LayersComponent } from './wizard/step/layers/layers.component';
import { StepComponent } from './wizard/step/step.component';
import { WizardComponent } from './wizard/wizard.component';
import { WizardService } from './wizard.service';

@NgModule({
  declarations: [
    CollapsableComponent,
    WizardComponent,
    StepComponent,
    ConfigComponent,
    TabsComponent,
    TabComponent,
    LayersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    WizardComponent
  ],
  providers: [
    WizardService
  ]
})
export class WizardModule { }

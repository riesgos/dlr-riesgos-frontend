import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { ConfigurationWizardComponent } from './configuration-wizard/configuration-wizard.component';
import { WizardPageComponent } from './wizard-page/wizard-page.component';
import { DynformsModule } from 'projects/dynforms/src/public_api';

@NgModule({
  declarations: [ConfigurationWizardComponent, WizardPageComponent],
  imports: [
    CommonModule,
    ClarityModule,
    DynformsModule
  ],
  exports: [ConfigurationWizardComponent, WizardPageComponent]
})
export class ConfigurationControlModule { }

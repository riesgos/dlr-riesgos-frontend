import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WpsProcess } from 'src/app/wps/control/wpsProcess';
import { UserconfigurableWpsDataDescription, isUserconfigurableWpsDataDescription } from '../userconfigurable_wpsdata';



@Component({
  selector: 'ukis-wizard-page',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.css']
})
export class WizardPageComponent implements OnInit {

  @Output() configSubmitted: EventEmitter<{pageId: string, values: any}> = new EventEmitter<{pageId: string, values: any}>();
  @Output() nextClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() reconfigureClicked: EventEmitter<string> = new EventEmitter<string>();
  @Input() process: WpsProcess;
  parameters: UserconfigurableWpsDataDescription[];

  constructor() { }

  ngOnInit() {
    this.parameters = this.process.inputDescriptions
      .filter(descr => isUserconfigurableWpsDataDescription(descr))
      .map(descr => descr as UserconfigurableWpsDataDescription);
  }

  onSubmit(data) {
    // @TODO: store.emmit(new ParametersProvided) ?
    this.configSubmitted.emit({pageId: this.process.processId(), values: data})
  }

  onNextClicked() {
    // @TODO: store.emmit(new NextClicked) ? 
    this.nextClicked.emit(this.process.processId());
  } 

  onReconfigureClicked () {
    // @TODO: store.emmit(new Reconfigure) ? 
    this.reconfigureClicked.emit(this.process.processId());
  }

}

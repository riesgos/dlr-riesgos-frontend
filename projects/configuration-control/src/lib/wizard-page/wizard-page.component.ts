import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Page } from '../model/page';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Parameter } from 'projects/dynforms/src/lib/parameter';



@Component({
  selector: 'ukis-wizard-page',
  templateUrl: './wizard-page.component.html',
  styleUrls: ['./wizard-page.component.css']
})
export class WizardPageComponent implements OnInit {

  @Output() configSubmitted: EventEmitter<{pageId: string, values: any}> = new EventEmitter<{pageId: string, values: any}>();
  @Output() nextClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() reconfigureClicked: EventEmitter<string> = new EventEmitter<string>();
  @Input() page: Page;

  constructor() { }

  ngOnInit() {
    
  }

  onSubmit(data) {
    this.configSubmitted.emit({pageId: this.page.getId(), values: data})
  }

  onNextClicked() {
    this.nextClicked.emit(this.page.getId());
  } 

  onReconfigureClicked () {
    this.reconfigureClicked.emit(this.page.getId());
  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LabelType, Options } from '@angular-slider/ngx-slider';

export interface SliderEntry {
  id: string;
  tickValue: number;
  displayText: string;
}


@Component({
  selector: 'app-group-slider',
  templateUrl: './group-slider.component.html',
  styleUrls: ['./group-slider.component.scss']
})
export class GroupSliderComponent implements OnInit {

  @Input() entries: SliderEntry[];
  @Input() selectionHandler: (newId: string) => void;
  public sliderForm: FormControl;
  public options: Options;

  constructor() {}

  ngOnInit(): void {
    this.sliderForm = new FormControl(this.entries[0].tickValue);
    this.sliderForm.valueChanges.subscribe(newVal => {
      const id = this.entries.find(e => e.tickValue === newVal).id;
      this.selectionHandler(id);
    });

    this.options = {
      animate: true,
      // showTicks: true,
      // showTicksValues: true,
      // getLegend: (value: number): string => {
      //   const displayName = this.entries.find(e => e.tickValue === value).displayText;
      //   return displayName;
      // },
      floor: this.entries.reduce((cuml, curr) => Math.min(cuml, curr.tickValue), 10000000),
      ceil: this.entries.reduce((cuml, curr) => Math.max(cuml, curr.tickValue), -10000000),
      stepsArray: this.entries.map(e => {
        return {
          legend: e.displayText,
          value: e.tickValue
        };
      }),
      translate: (value: number): string => {
        const displayName = this.entries.find(e => e.tickValue === value).displayText;
        return displayName;
      }
    };
  }

}

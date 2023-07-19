import { Component, Input, OnInit } from '@angular/core';
import { PartitionName, RiesgosState, ScenarioName, ParameterConfiguration } from 'src/app/state/state';
import * as AppActions from 'src/app/state/actions';
import { Store } from '@ngrx/store';
import { ControlFactory, findControlFactory } from '../../../wizard.augmenters';


interface FormElementData {
  options: string[],
  selected: string | undefined
}

interface FormElements {
  [elementId: string]: FormElementData
}


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  @Input() scenario!: ScenarioName;
  @Input() partition!: PartitionName;
  @Input() stepId!: string;
  @Input() data!: ParameterConfiguration[];
  @Input() autoPilot!: boolean | undefined;
  public formElements: FormElements = {};
  

  constructor(private store: Store<{ riesgos: RiesgosState }>) {}

  ngOnInit(): void {
    this.formElements = this.dataToFormElements(this.data);
  }


  public select(productId: string, value: string | undefined) {
    this.formElements[productId].selected = value;
    const dataDict = this.formElementsToDict(this.formElements, this.data);

    this.store.dispatch(AppActions.stepConfig({
      scenario: this.scenario,
      partition: this.partition,
      stepId: this.stepId,
      values: dataDict
  }));
  }

  public execute() {
    this.store.dispatch(AppActions.stepExecStart({ scenario: this.scenario, partition: this.partition, step: this.stepId }));
  }

  public allValuesSet(): boolean {
    for (const [parameterId, parameterData] of Object.entries(this.formElements)) {
      if (parameterData.selected === undefined) return false;
    }
    return true;
  }

  public isSelected(productId: string, option: string) {
    const triedValue = option;
    const actualValue = this.formElements[productId].selected;
    return triedValue === actualValue;
  }



  private dataToFormElements(data: ParameterConfiguration[]): FormElements {
    const controlFactory = findControlFactory(this.scenario, this.partition, this.stepId)!;

    const formElements: FormElements = {};
    for (const input of data) {
      const formElement: FormElementData = { options: [], selected: undefined };
      for (const option of input.options) {
        formElement.options.push(controlFactory.optionToKey(input.id, option));
      }
      if (input.selected) {
        formElement.selected = controlFactory.optionToKey(input.id, input.selected);
      }

      formElements[input.id] = formElement;
    }

    return formElements;
  }

  private formElementsToDict(formElements: FormElements, data: ParameterConfiguration[]) {
    const controlFactory = findControlFactory(this.scenario, this.partition, this.stepId)!;

    const dict: {[parameterId: string]: any} = {};
    for (const [parameterId, formData] of Object.entries(formElements)) {
      const originalData = data.find(d => d.id === parameterId)!;
      let pickedOption = undefined;
      if (formData.selected !== undefined) pickedOption = controlFactory.keyToOption(formData.selected, originalData.options);
      dict[parameterId] = pickedOption;
    }

    return dict;
  }

}

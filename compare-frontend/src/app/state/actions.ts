import { createAction, props } from '@ngrx/store';
import { API_ScenarioInfo } from '../services/backend.service';
import { ModalState, PartitionName, RiesgosProduct, RiesgosScenarioMapState, ScenarioName } from './state';
import { RuleSetName } from './rules';


export const ruleSetPicked = createAction('Rule-set picked', props<{ rules: RuleSetName }>());

export const scenarioLoadStart = createAction('Scenario load start');
export const scenarioLoadSuccess = createAction('Scenario load success', props<{ scenarios: API_ScenarioInfo[] }>());
export const scenarioLoadFailure = createAction('Scenario load failure', props<{ error: any }>());
export const scenarioPicked = createAction('Scenario picked', props<{ scenario: ScenarioName }>());
export const movingBackToMenu = createAction('Move back');

export const stepSetFocus = createAction('Step select', props<{ scenario: ScenarioName, partition: PartitionName, stepId: string, focus: boolean }>());
export const stepConfig = createAction('Step config', props<{ scenario: ScenarioName, partition: PartitionName, stepId: string, values: {[key: string]: any } }>());
export const stepExecStart = createAction('Step exec start', props<{ scenario: ScenarioName, partition: PartitionName, step: string }>());
export const stepExecSuccess = createAction('Step exec success', props<{ scenario: ScenarioName, partition: PartitionName, step: string, newData: RiesgosProduct[] }>());
export const stepExecFailure = createAction('Step exec failure', props<{ scenario: ScenarioName, partition: PartitionName, step: string, error: any }>());
export const stepReset = createAction('Step reset', props<{ scenario: ScenarioName, partition: PartitionName, stepId: string }>());
export const stepResetAll = createAction('Step reset', props<{ scenario: ScenarioName, partition: PartitionName }>());

export const autoPilotEnqueue = createAction('Auto-pilot: enqueing', props<{ scenario: ScenarioName, partition: PartitionName }>());
export const autoPilotDequeue = createAction('Auto-pilot: dequeuing', props<{ scenario: ScenarioName, partition: PartitionName, step: string }>());

export const mapMove = createAction('Map move', props<{ scenario: ScenarioName, partition: PartitionName, zoom: number, center: number[] }>());
export const mapClick = createAction('Map click', props<{ scenario: ScenarioName, partition: PartitionName, location: number[] | undefined, clickedFeature?: {compositeId: string} }>());
export const mapLayerVisibility = createAction('Map layer visibility', props<{ scenario: ScenarioName, partition: PartitionName, stepId: string, config: RiesgosScenarioMapState["layerSettings"] }>());

export const togglePartition = createAction('Toggling partition', props<{ scenario: ScenarioName, partition: PartitionName }>());
export const toggleWizard = createAction('Toggle wizard', props<{ scenario: ScenarioName, partition: PartitionName, expand: boolean }>());

export const openModal = createAction('Opening modal', props<{ scenario: ScenarioName, partition: PartitionName, args: ModalState['args'] }>());
export const closeModal = createAction('Closing modal', props<{ scenario: ScenarioName, partition: PartitionName }>());

export const setZoomToStep = createAction('Setting zoom-to-step behaviour', props<{ zoomToStep: boolean; }>());
export const setLinkMapViews = createAction('Setting link-map-views behaviour', props<{ linkMapViews: boolean; }>());


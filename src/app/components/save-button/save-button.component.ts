import { Component, OnInit, Input } from '@angular/core';
import { UtilStoreService } from '@ukis/services-util-store';
import { Form, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getCurrentScenarioRiesgosState } from 'src/app/riesgos/riesgos.selectors';
import { RiesgosScenarioState } from 'src/app/riesgos/riesgos.state';
import { RiesgosDataUpdate, RestaringScenario } from 'src/app/riesgos/riesgos.actions';
import { meta } from '@turf/turf';


interface StorageMetadata {
    name: string;
    date: Date;
}

@Component({
    selector: 'ukis-save-buttons',
    templateUrl: './save-button.component.html',
    styleUrls: ['./save-button.component.scss']
})
export class SaveButtonComponent implements OnInit {

    showResetModal = false;
    showRestoreModal = false;
    showStoreModal = false;
    nameControl: FormControl;
    private currentState: RiesgosScenarioState;
    public storageMetadata: StorageMetadata[] = [];
    public selectedStorageMetadata: StorageMetadata;
    private storageMetadataKey = 'RIESGOS_STORAGE_METADATA';

    constructor(
        private storageService: UtilStoreService,
        private store: Store<State>
    ) {
        this.nameControl = new FormControl('Save state', [Validators.required]);
    }

    ngOnInit() {
        this.store.pipe(select(getCurrentScenarioRiesgosState)).subscribe((state: RiesgosScenarioState) => {
            this.currentState = state;
        });
        this.storageMetadata = this.getStorageMetadata();
    }

    storeRow(): void {
        const name = this.nameControl.value;
        const data = this.currentState;
        this.storeData(name, data);
        this.showStoreModal = false;
    }

    restoreSelectedRow(): void {
        if (this.selectedStorageMetadata) {
            const stateToRestore = this.restoreData(this.selectedStorageMetadata);
            const processes = stateToRestore.processStates;
            const products = stateToRestore.productValues;
            const graph = stateToRestore.graph;
            this.store.dispatch(new RiesgosDataUpdate({processes, products, graph}));
        }
        this.showRestoreModal = false;
    }

    onResetClicked(): void {
        const currentScenario = this.currentState.scenario;
        this.store.dispatch(new RestaringScenario({scenario: currentScenario}));
        this.showResetModal = false;
    }

    private storeData(name: string, data: RiesgosScenarioState): void {
        const metadata: StorageMetadata = { name: name, date: new Date() };
        this.storageMetadata.push(metadata);
        this.storeStorageMetadata(this.storageMetadata);
        this.storageService.local(name, data);
    }

    private restoreData(storageMetadata: StorageMetadata): RiesgosScenarioState {
        return this.storageService.local(storageMetadata.name);
    }

    private getStorageMetadata(): StorageMetadata[] {
        const metadata = this.storageService.local(this.storageMetadataKey);
        if (!metadata) {
            return [];
        } else {
            return metadata;
        }
    }

    private storeStorageMetadata(storageMetadata: StorageMetadata[]): void {
        this.storageService.local(this.storageMetadataKey, storageMetadata);
    }

}

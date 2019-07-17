import { Component, OnInit, Input } from '@angular/core';
import { UtilStoreService } from '@ukis/services-util-store';
import { Form, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { State } from 'src/app/ngrx_register';
import { getFullWpsState } from 'src/app/wps/wps.selectors';
import { WpsState } from 'src/app/wps/wps.state';
import { WpsDataUpdate } from 'src/app/wps/wps.actions';


interface StorageRow {
    name: string,
    date: Date,
    data: WpsState
}

@Component({
    selector: 'ukis-save-buttons',
    templateUrl: './save-button.component.html',
    styleUrls: ['./save-button.component.scss']
})
export class SaveButtonComponent implements OnInit {

    showResetModal: boolean = false;
    showRestoreModal: boolean = false;
    showStoreModal: boolean = false;
    nameControl: FormControl;
    dataStorage: StorageRow[] = [];
    selectedStorageRow: StorageRow;

    constructor(
        private storageService: UtilStoreService,
        private store: Store<State>
    ) {
        this.nameControl = new FormControl("Save state", [Validators.required]);
    }

    ngOnInit() {
    }

    storeRow(): void {
        let name = this.nameControl.value;

        this.store.pipe(select(getFullWpsState)).subscribe((state: WpsState) => {

            let data = state;
            this.dataStorage.push({
                name: name,
                data: data,
                date: new Date()
            });
            this.showStoreModal = false;

        })

    }

    restoreSelectedRow(): void {
        if (this.selectedStorageRow) {
            const processes = this.selectedStorageRow.data.processStates;
            const products = this.selectedStorageRow.data.productValues;
            this.store.dispatch(new WpsDataUpdate({processes: processes, products: products}))
        }
        this.showRestoreModal = false;
    }

    onResetClicked(): void {
        this.showResetModal = false;
    }

}

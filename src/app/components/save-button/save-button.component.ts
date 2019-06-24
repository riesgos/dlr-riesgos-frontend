import { Component, OnInit, Input } from '@angular/core';
import { UtilStoreService } from '@ukis/services-util-store';
import { Form, FormControl, Validators } from '@angular/forms';


interface StorageRow {
    name: string,
    date: Date,
    data: any
}

@Component({
    selector: 'ukis-save-buttons',
    templateUrl: './save-button.component.html',
    styleUrls: ['./save-button.component.scss']
})
export class SaveButtonComponent implements OnInit {

    @Input() saveProvider: SaveProvider;
    showResetModal: boolean = false;
    showRestoreModal: boolean = false;
    showStoreModal: boolean = false;
    nameControl: FormControl;
    dataStorage: StorageRow[] = [];
    selectedStorageRow: StorageRow;

    constructor(
        //private storageService: UtilStoreService
    ) {
        this.nameControl = new FormControl("Save state", [Validators.required]);
    }

    ngOnInit() {
    }

    storeRow(): void {
        let name = this.nameControl.value;
        let data = this.saveProvider.getDataToSave();
        this.dataStorage.push({
            name: name,
            data: data,
            date: new Date()
        });
        this.showStoreModal = false;
    }

    restoreSelectedRow(): void {
        if (this.selectedStorageRow) this.saveProvider.restoreData(this.selectedStorageRow.data);
        this.showRestoreModal = false;
    }

    onResetClicked(): void {
        this.saveProvider.reset();
        this.showResetModal = false;
    }

}


export interface SaveProvider {
    getDataToSave(): any;
    restoreData(data: any): void;
    reset(): void;
}
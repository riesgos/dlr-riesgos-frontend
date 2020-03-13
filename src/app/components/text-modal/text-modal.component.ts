import { Component, OnInit } from '@angular/core';
import { UtilStoreService } from '@dlr-eoc/services-util-store';

@Component({
  selector: 'ukis-text-modal',
  templateUrl: './text-modal.component.html',
  styleUrls: ['./text-modal.component.scss']
})
export class TextModalComponent implements OnInit {

  showModal: boolean;
  showModalKey = 'WDS_SM';

  constructor(private storageService: UtilStoreService) { }

  ngOnInit() {
    const storedVal = this.storageService.local(this.showModalKey);
    if (storedVal !== null) {
      this.showModal = storedVal;
    } else {
      this.showModal = true;
    }
  }

  hideModalSave() {
    this.showModal = false;
    this.storageService.local(this.showModalKey, false);
  }

}

import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'ukis-text-modal',
  templateUrl: './text-modal.component.html',
  styleUrls: ['./text-modal.component.scss']
})
export class TextModalComponent implements OnInit {

  showModal: boolean;
  showModalKey = 'showModal';

  constructor(private storageService: StoreService) { }

  ngOnInit() {
    const storedVal = this.storageService.readLocal(this.showModalKey);
    if (storedVal !== null) {
      this.showModal = storedVal === 'false' ? false : true;
    } else {
      this.showModal = true;
    }
  }

  hideModalSave() {
    this.showModal = false;
    this.storageService.local(this.showModalKey, 'false');
  }

}

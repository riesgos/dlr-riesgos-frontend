import { Component, OnInit } from '@angular/core';
import { UtilStoreService } from '@ukis/services-util-store';

@Component({
  selector: 'app-disclaimerpopup',
  templateUrl: './disclaimerpopup.component.html',
  styleUrls: ['./disclaimerpopup.component.scss']
})
export class DisclaimerpopupComponent implements OnInit {

  showModal: boolean;
  showModalKey = 'RIESGOS_SHOW_DISCLAIMER';

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

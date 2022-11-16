import { APP_INITIALIZER, Component, Inject, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/configService/configService';
import { StoreService } from 'src/app/services/localStorage/store.service';

@Component({
  selector: 'app-disclaimerpopup',
  templateUrl: './disclaimerpopup.component.html',
  styleUrls: ['./disclaimerpopup.component.scss']
})
export class DisclaimerpopupComponent implements OnInit {

  showModal: boolean = true;
  showModalKey = 'RIESGOS_SHOW_DISCLAIMER';

  constructor(
    private storageService: StoreService,
    private configService: ConfigService
  ) {
    this.showModal = this.configService.getConfig().production ? true : false;
  }

  ngOnInit() {
    // const storedVal = this.storageService.local(this.showModalKey);
    // if (storedVal !== null) {
    //   this.showModal = storedVal;
    // } else {
    //   this.showModal = true;
    // }
  }

  hideModalSave() {
    this.showModal = false;
    this.storageService.local(this.showModalKey, 'false');
  }

}

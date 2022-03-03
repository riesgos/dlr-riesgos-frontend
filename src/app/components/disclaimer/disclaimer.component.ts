import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertService } from '../global-alert/alert.service';

@Component({
  selector: 'ukis-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent implements OnInit, OnDestroy {
  public isExpanded: boolean;
  onLangChange: Subscription;

  constructor(private translate: TranslateService, private alertService: AlertService) {
    this.isExpanded = environment.production ? true : false;
  }

  ngOnInit() {
    if (this.isExpanded) {
      this.translate.get('This is a demonstrator!').pipe(first()).subscribe(() => {
        this.setAlert();
      })
    }
  }
  ngOnDestroy(): void {
    if(this.onLangChange){
      this.onLangChange.unsubscribe();
    }
  }

  setAlert() {
    this.alertService.alert({
      type: 'info',
      text: this.translate.instant('This is a demonstrator!'),
      closeable: true,
      closeAction: () => { this.isExpanded = false; }
    });
    this.isExpanded = true;
  }

  toggleAlert() {
    if (!this.isExpanded) {
      this.setAlert();

      this.onLangChange = this.translate.onLangChange.subscribe(() => {
        console.log('change')
        this.setAlert();
      });
    } else {
      if(this.onLangChange){
        this.onLangChange.unsubscribe();
      }
      this.alertService.alert(null);
      this.isExpanded = false;
    }
  }
}

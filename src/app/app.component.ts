import { Component, ViewEncapsulation, OnInit } from '@angular/core';


import '@webcomponents/custom-elements';
import '@clr/icons/shapes/all-shapes';
import '@clr/icons/shapes/commerce-shapes';
import '@clr/icons/shapes/core-shapes';
import '@clr/icons/shapes/essential-shapes';
import '@clr/icons/shapes/media-shapes';
import '@clr/icons/shapes/social-shapes';
import '@clr/icons/shapes/technology-shapes';
import '@clr/icons/shapes/travel-shapes';
import './components/icons/ukis';

import { AlertService, IAlert } from './components/global-alert/alert.service';
import { FooterService } from './components/global-footer/footer.service';
import { ProgressService, IProgress } from './components/global-progress/progress.service';
import {ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from './ngrx_register';
import { AppInit } from './focus/focus.actions';

@Component({
  selector: 'ukis-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UkisComponent implements OnInit {
  
  title = 'RIESGOS Demonstrator';

  ui = {
    floating: false,
    footer: false,
    alert: null,
    progress: null
  };

  currentMapName: Observable<string>;

  constructor(
    private footerService: FooterService,
    private alertService: AlertService,
    private progressService: ProgressService,
    private route: ActivatedRoute,
    private store: Store<State>
  ) {
    this.getHtmlMeta(['title', 'version', 'description']);

    if (this['TITLE']) {
      this.title = this['TITLE'];
    }

    this.alertService.alert$.subscribe((ev) => {
      this.setAlert(ev)
    });

    this.footerService.footer$.subscribe((ev) => {
      this.showFooter(ev)
    });

    this.progressService.progress$.subscribe((ev) => {
      this.showProgress(ev)
    })

    this.currentMapName = this.route.queryParamMap.pipe(
      map(params => {
        switch (params.get('id')) {
          case 'c1':
            return 'Chile';
          case 'e1':
            return 'Ecuador';
          case 'p1':
            return 'Peru';
          default:
            const out = params.get('id') || '';
            return out;
        }
      })
    );

  }

  ngOnInit(): void {
    this.store.dispatch(new AppInit());
  }

  showProgress = (progress: IProgress) => {
    //@ts-ignore
    this.ui.progress = progress;
  }

  showFooter = (show: boolean) => {
    this.ui.footer = show;
  }

  setAlert = (alert: IAlert) => {
    //@ts-ignore
    this.ui.alert = alert;
  }

  getHtmlMeta(names: string[]) {
    var _ref = document.getElementsByTagName('meta');
    for (let _i = 0, _len = _ref.length; _i < _len; _i++) {
      let meta = _ref[_i];
      let name = meta.getAttribute('name');
      if (name && names.includes(name)) {
        this[name.toUpperCase()] = meta.getAttribute('content') || eval(meta.getAttribute('value') || '');
      }
    }
  }
}

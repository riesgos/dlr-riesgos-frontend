import { Component, OnDestroy, ViewEncapsulation, OnInit } from '@angular/core';

import './components/icons/ukis';

import { AlertService, IAlert } from './components/global-alert/alert.service';
import { ProgressService, IProgress } from './components/global-progress/progress.service';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { State } from './ngrx_register';
import { AppInit } from './focus/focus.actions';
import { ThemeService } from './services/theme/theme.service';
import { appVersion } from 'src/environments/version';

interface IUi {
  floating: boolean;
  flipped: boolean;
  alert: null | IAlert;
  progress: null | IProgress;
  subs: Subscription[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'RIESGOS Demonstrator';
  shortTitle = 'RIESGOS Demonstrator';
  currentMapName: Observable<string>;
  ui: IUi = {
    floating: false,
    flipped: false,
    alert: null,
    progress: null,
    subs: null
  };
  theme$: Observable<string>;
  version = appVersion;

  constructor(
    private alertService: AlertService,
    private progressService: ProgressService,
    private route: ActivatedRoute,
    private store: Store<State>,
    private themeSvc: ThemeService,
  ) {

    const meta = this.getHtmlMeta(['title', 'version', 'description', 'short-title']);
    // if (meta.title) {
    //   this.title = meta.title;
    // }
    if (meta['short-title']) {
      this.shortTitle = meta['short-title'];
    }
    this.ui.subs = this.sub2AlertAndProgress();

    this.currentMapName = this.route.queryParamMap.pipe(
      map(params => {
        switch (params.get('id')) {
          case 'c1':
          case 'c2':
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

    this.theme$ = this.themeSvc.getActiveTheme().pipe(
      map(t => t.name)
    );
  }

  ngOnInit(): void {
    this.store.dispatch(new AppInit());
  }

  /**
   *  returns an object with the keys from the input array
   */
  getHtmlMeta(names: string[]) {
    const ref = document.getElementsByTagName('meta');
    const obj: { [name: string]: string } = {};
    for (let i = 0, len = ref.length; i < len; i++) {
      const meta = ref[i];
      const name = meta.getAttribute('name');
      if (names.includes(name)) {
        obj[name] = meta.getAttribute('content') || meta.getAttribute('value');
      }
    }
    return obj;
  }

  sub2AlertAndProgress() {
    const subs: Subscription[] = [
      this.alertService.alert$.subscribe((alert) => {
        this.ui.alert = alert;
      }),
      this.progressService.progress$.subscribe((progress) => {
        this.ui.progress = progress;
      })
    ];
    return subs;
  }

  ngOnDestroy() {
    this.ui.subs.map(s => s.unsubscribe());
  }
}

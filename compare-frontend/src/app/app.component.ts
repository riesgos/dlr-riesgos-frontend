import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RiesgosState } from './state/state';
import { Observable, map } from 'rxjs';
import { RuleSetName } from './state/rules';
import { movingBackToMenu } from './state/actions';
import { APP_BASE_HREF } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  public ruleSet$: Observable<RuleSetName | 'none'>;
  @ViewChild('main', {read: ElementRef, static: true}) main!: ElementRef<HTMLDivElement>;

  constructor(
      private router: Router,
      private store: Store<{riesgos: RiesgosState}>,
      @Inject(APP_BASE_HREF) public baseHref: string
  ) {
    this.ruleSet$ = this.store.select(state => state.riesgos.rules).pipe(
      map(v => v === undefined ? 'none' : v)
    );
  }

  clickOnModes() {
    this.store.dispatch(movingBackToMenu());
    this.router.navigateByUrl("/");
  }

  clickOnTutorial() {
    if (this.getCurrentUrl().includes('tutorial')) return;
    window.open(this.getTutorialUrl(), "_self"); //, '_blank');
  }

  clickOnLicenses() {
    if (this.getCurrentUrl().includes('licenses')) return;
    window.open(this.getLicensesUrl(), "_self"); //, '_blank');
  }

  async printPage() {
    try {
      window.print();
    } catch (error) {
      console.warn(error);
    }
    // const png = await toPng(this.main.nativeElement, {
    //   canvasHeight: 800,
    //   canvasWidth: 1024,
    // });
    // downloadURI(png, "map.png");
  }

  getCurrentUrl() {
    return window.location.href;
  }

  private getTutorialUrl() {
    // https://itnext.io/how-to-extract-the-base-href-in-angular-bbbd559a1ad6
    const currentUrl = new URL(this.getCurrentUrl());
    // const path = currentUrl.pathname.split("/").slice(1);
    // const isOnSubPath = path.includes(this.baseHref);
    return `${currentUrl.origin}${this.baseHref}tutorial`;
  }

  private getLicensesUrl() {
    // https://itnext.io/how-to-extract-the-base-href-in-angular-bbbd559a1ad6
    const currentUrl = new URL(this.getCurrentUrl());
    // const path = currentUrl.pathname.split("/").slice(1);
    // const isOnSubPath = path.includes(this.baseHref);
    return `${currentUrl.origin}${this.baseHref}licenses`;
  }
}

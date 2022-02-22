import { Inject, Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

export interface ThemeMetadata {
  name: 'light' | 'dark';
  displayName: string;
}


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themes: ThemeMetadata[] = [{
    displayName: 'Light',
    name: 'light',
  }, {
    displayName: 'Dark',
    name: 'dark',
  }];

  private styleSelector = 'styles-theme-';
  private styleID = 'dynamicStyle';

  private activeTheme: BehaviorSubject<ThemeMetadata>;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.activeTheme = new BehaviorSubject<ThemeMetadata>(this.themes[0]);
    this.getInitialTheme();
  }

  /**
   * check angular.json for the available styles and the default injected style!
   * https://angular.io/guide/workspace-config#styles-and-scripts-configuration
   *
   * This is the old way to style clarity angular it should be updated to custom css properties!!!
   * also remove "node_modules/@clr/icons/clr-icons.min.css"
   */
  private getInitialTheme(): void {
    const links = Array.from(this.document.getElementsByTagName('link'));
    for (const link of links) {
      if (link.href.includes(this.styleSelector)) {
        link.id = this.styleID;
        const themeName = link.href.split(this.styleSelector)[1]?.split('.css')[0];
        const initialTheme = this.themes.find(t => t.name === themeName);
        this.activeTheme.next(initialTheme);
      }
    }
  }

  public getThemes(): ThemeMetadata[] {
    return this.themes;
  }

  public getActiveTheme(): Observable<ThemeMetadata> {
    return this.activeTheme;
  }

  public selectTheme(themeName: ThemeMetadata['name']) {
    const theme = this.themes.find(t => t.name === themeName);
    this.activeTheme.next(theme);

    // this is used for clarity custom props styling
    // this.document.body.setAttribute('cds-theme', theme.name);

    const hasStyle = this.document.getElementById(this.styleID) as HTMLLinkElement;
    if (hasStyle) {
      if (hasStyle.href !== `${this.styleSelector}${theme.name}.css`) {
        hasStyle.href = `${this.styleSelector}${theme.name}.css`;
      }
    } else {
      const head = this.document.getElementsByTagName('head')[0];
      const link = this.document.createElement('link');
      link.rel = 'stylesheet';
      link.id = this.styleID;
      link.href = `${this.styleSelector}${theme.name}.css`;
      head.appendChild(link);
    }
  }
}

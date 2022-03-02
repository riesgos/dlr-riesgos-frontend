import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface ThemeMetadata {
  name: string;
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

    private activeTheme: BehaviorSubject<ThemeMetadata>;

  constructor() {
    const initialTheme = this.themes[0];
    this.activeTheme = new BehaviorSubject<ThemeMetadata>(initialTheme);
    this.selectTheme(initialTheme.name);
  }

  public getThemes(): ThemeMetadata[] {
    return this.themes;
  }

  public getActiveTheme(): Observable<ThemeMetadata> {
    return this.activeTheme;
  }

  public selectTheme(themeName: string) {
    const theme = this.themes.find(t => t.name === themeName);
    this.activeTheme.next(theme);
  }
}

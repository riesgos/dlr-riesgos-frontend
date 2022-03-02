import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeMetadata, ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'ukis-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss']
})
export class ThemePickerComponent {

  public themes: ThemeMetadata[];
  public currentTheme$: Observable<ThemeMetadata>;

  constructor(
    private themeService: ThemeService
  ) {
    this.themes = this.themeService.getThemes();
    this.currentTheme$ = this.themeService.getActiveTheme();
  }

  selectTheme(themeName: string): void {
    this.themeService.selectTheme(themeName);
  }
}

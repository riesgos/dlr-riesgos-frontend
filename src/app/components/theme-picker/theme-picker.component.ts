import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ThemeMetadata, ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'ukis-theme-picker',
  templateUrl: './theme-picker.component.html',
  styleUrls: ['./theme-picker.component.scss']
})
export class ThemePickerComponent implements OnDestroy {

  public themes: ThemeMetadata[];
  public currentTheme: ThemeMetadata;
  subs: Subscription[] = [];

  constructor(
    private themeService: ThemeService
  ) {
    this.themes = this.themeService.getThemes();
    const themeSub = this.themeService.getActiveTheme().subscribe(t => {
      this.currentTheme = t;
    });
    this.subs.push(themeSub);
  }

  selectTheme(themeName: ThemeMetadata['name']): void {
    this.themeService.selectTheme(themeName);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }
}

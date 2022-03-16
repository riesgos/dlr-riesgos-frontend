import { Component, OnInit, AfterContentChecked, HostBinding } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SimplifiedTranslationService } from 'src/app/services/simplifiedTranslation/simplified-translation.service';




interface Entry {
  title: string;
  body: string;
}

interface TranslatableEntry {
  anchor: string;
  en: Entry;
  es: Entry;
}

interface BlogEntry extends Entry {
  anchor: string;
}


@Component({
  selector: 'ukis-route-documentation',
  templateUrl: './route-documentation.component.html',
  styleUrls: ['./route-documentation.component.scss']
})
export class RouteDocumentationComponent implements OnInit, AfterContentChecked {
  @HostBinding('class') class = 'content-container';

  public entries$: Observable<BlogEntry[]>;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private translator: SimplifiedTranslationService
  ) { }

  ngOnInit() {

    const wikiData$ = this.http.get<TranslatableEntry[]>('assets/wiki/wiki.json');
    const currentLang$ = this.translator.getCurrentLang();


    this.entries$ = combineLatest([currentLang$, wikiData$]).pipe(map(([lang, wikiData]: [string, TranslatableEntry[]]) => {

      const newEntries: BlogEntry[] = [];
      for (const e of wikiData) {
        newEntries.push({
          anchor: e.anchor,
          title: e[lang.toLowerCase()].title,
          body: e[lang.toLowerCase()].body
        });
      }

      return newEntries;
    }));
  }

  ngAfterContentChecked(): void {
    if (this.route.snapshot.fragment) {
      this.scrollTo(this.route.snapshot.fragment);
    }
  }

  private scrollTo(fragmentId: string): void {
    const element = document.querySelector('#' + fragmentId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}

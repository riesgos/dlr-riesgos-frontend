import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { withLatestFrom, map, delay } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';




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

  public entries$: Observable<BlogEntry[]>;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private translator: TranslateService
  ) { }

  ngOnInit() {

    const wikiData$ = this.http.get<TranslatableEntry[]>('assets/wiki/wiki.json');
    const currentLang$ = new BehaviorSubject<string>(this.translator.currentLang);
    this.translator.onLangChange.subscribe((newLang: LangChangeEvent) => currentLang$.next(newLang.lang));


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
    this.route.fragment.pipe(
      (delay(500))
    ).subscribe(fragmentName => this.scrollTo(fragmentName));
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

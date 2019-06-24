import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Page, PageService } from '../model/page';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';



@Component({
  selector: 'ukis-configuration-wizard',
  templateUrl: './configuration-wizard.component.html',
  styleUrls: ['./configuration-wizard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigurationWizardComponent implements OnInit {

  @Input() pageService: PageService;
  pages: Page[];
  private focussedPageId: BehaviorSubject<string>;

  constructor() {
  }
  
  ngOnInit() { 
    this.pages = this.pageService.getPages();
    this.focussedPageId = this.pageService.focussedPageId();
  }

 


  hasFocus(page: Page): Observable<boolean> {
    return this.getFocussedPageId().pipe(
      map((pageId: string) => {
        return (pageId == page.getId())
      })
    );
  }

  getFocussedPageId(): Observable<string> {
    return this.focussedPageId;
  }

  onConfigSubmitted(data) {
    for(let parameterId in data.values) {
      let parameterValue = data.values[parameterId];
      this.pageService.setConfig(parameterId, parameterValue);
    }
    this.pageService.onSubmit(data.pageId);
  }

  onNextClicked(evt) {
    let nextPage = this.getNextPage();
    this.focussedPageId.next(nextPage.getId());
    //this.focusOn(nextPage);
  }

  onReconfigureClicked(pageId: string) {
    this.pageService.onReconfigureClicked(pageId);
  }

  private getPageById(pageId: string): Page {
    return this.pages.find(page => page.getId() == pageId);
  }

  private getNextPage(): Page {
    let activePageId = this.focussedPageId.getValue();
    let nextPageIndex = 0;
    this.pages.forEach((page, index) => {
      if(page.getId() == activePageId) nextPageIndex = index + 1;
    });
    return this.pages[nextPageIndex];
  }

  onBlockClicked(event, i) {
    const focussedPage = this.pages[i];
    this.focussedPageId.next(focussedPage.getId());
  }
}

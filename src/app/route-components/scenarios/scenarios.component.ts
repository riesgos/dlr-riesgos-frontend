import { Component, OnInit, HostBinding } from '@angular/core';

type previewmap = { id: string | number, index: number, title: string, preview: string, content?: any, disabled?: boolean };

@Component({
  selector: 'ukis-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.scss']
})
export class ScenariosComponent implements OnInit {
  @HostBinding('class') class = 'content-container';

  scenarios: previewmap[] = [];
  showInfo = false;
  modalOpen = false;
  selectedScenario: previewmap;

  hazardTypes = [{
    abbreviation: 'e',
    title: 'earthquakes'
  },
  {
    abbreviation: 'l',
    title: 'landslides'
  },
  {
    abbreviation: 'v',
    title: 'volcanoes'
  },
  {
    abbreviation: 'f',
    title: 'floods'
  },
  {
    abbreviation: 't',
    title: 'tsunamis'
  }];

  elementsAtRisk = [{
    abbreviation: 'i',
    title: 'infrastructure'
  }, {
    abbreviation: 'k',
    title: 'critical infrastructure'
  },
  {
    abbreviation: 'u',
    title: 'vulnerability'
  },
  {
    abbreviation: 'w',
    title: 'water supply'
  },
  {
    abbreviation: 'x',
    title: 'Exposure'
  },
  {
    abbreviation: 'z',
    title: 'electricity'
  }];

  constructor() {
    this.scenarios = [
      { id: 'c1', title: 'Showcase Chile', preview: 'assets/data/Showcase-c1.jpg', content: '', index: 1 },
      { id: 'e1', title: 'Showcase Ecuador', preview: 'assets/data/Showcase-e1.jpg', content: '', index: 2 },
      { id: 'p1', title: 'Showcase Peru', preview: 'assets/data/Showcase-c1.jpg', content: '', index: 3 }];
  }

  ngOnInit() {

  }

  showModal(map: previewmap) {
    this.selectedScenario = map;
    this.showInfo = true;
    this.modalOpen = true;
  }

}

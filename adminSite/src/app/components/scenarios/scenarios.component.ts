import { Component, OnInit } from '@angular/core';
import { RiesgosClient } from '../../../../../middleware/src/client/riesgosClient';
import { HttpClient } from '../../../../../middleware/src/http_client/http_client';

@Component({
  selector: 'app-scenarios',
  templateUrl: './scenarios.component.html',
  styleUrls: ['./scenarios.component.scss']
})
export class ScenariosComponent implements OnInit {
  private client: RiesgosClient;

  constructor() {
    const http = new HttpClient();
    this.client = new RiesgosClient('', http);
  }

  ngOnInit(): void {
  }

}

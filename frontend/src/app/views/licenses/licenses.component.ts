import { Component, HostBinding, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'ukis-licenses',
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.scss']
})
export class LicensesComponent implements OnInit {
  @HostBinding('class') class = 'content-container';

  public licenses: Observable<string>;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.licenses = this.http.get('3rdpartylicenses.txt', { responseType: 'text' });
  }

}


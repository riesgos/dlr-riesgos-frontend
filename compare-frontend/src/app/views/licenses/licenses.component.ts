import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';


@Component({
  selector: 'ukis-licenses',
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.scss']
})
export class LicensesComponent implements OnInit {
  @HostBinding('class') class = 'content-container';

  public licenses!: Observable<string>;

  constructor(private http: HttpClient, @Inject(APP_BASE_HREF) private baseHref: string) { }

  ngOnInit() {
    const location = window.location;
    this.licenses = this.http.get(`${location.origin}/${this.baseHref}/3rdpartylicenses.txt`, { responseType: 'text' });
  }

}


import { Component, HostBinding, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';




interface License {
  name: string;
  license: string;
  repository: string;
  publisher: string;
}


@Component({
  selector: 'ukis-licenses',
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.scss']
})
export class LicensesComponent implements OnInit {
  @HostBinding('class') class = 'content-container';

  public licenses: Observable<License[]>;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.licenses = this.http.get('assets/licenses.json').pipe(map(data => {
      const licenses: License[] = [];
      for (const name in data) {
        if (data[name]) {
          const val = data[name];
          licenses.push({
            name: name,
            license: val.licenses,
            repository: val.repository,
            publisher: val.publisher
          });
        }
      }
      return licenses;
    }));
  }

}


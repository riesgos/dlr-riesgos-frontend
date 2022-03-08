import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ukis-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent implements OnInit {


  public isExpanded: boolean;

  constructor(private route: ActivatedRoute) {
    this.isExpanded = environment.production ? true : false;
  }

  ngOnInit() {
    // this.route.queryParams.subscribe((data) => {
    //   if (data['id']) {
    //     this.isExpanded = true;
    //   } else {
    //     this.isExpanded = false;
    //   }
    // });
  }
}

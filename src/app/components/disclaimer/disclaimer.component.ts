import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

@Component({
  selector: 'ukis-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent implements OnInit {


  isExpanded = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((data) => {
      if (data['id']) {
        this.isExpanded = true;
      } else {
        this.isExpanded = false;
      }
    });
  }
}

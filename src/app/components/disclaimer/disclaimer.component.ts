import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ukis-disclaimer',
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss']
})
export class DisclaimerComponent implements OnInit {


  isExpanded = true;

  constructor() { }

  ngOnInit() {
  }

}

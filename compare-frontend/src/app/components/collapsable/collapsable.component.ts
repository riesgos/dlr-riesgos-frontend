import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-collapsable',
  templateUrl: './collapsable.component.html',
  styleUrls: ['./collapsable.component.css']
})
export class CollapsableComponent implements OnInit {

  public expanded = false;

  constructor() {
  }

  ngOnInit(): void {}


}

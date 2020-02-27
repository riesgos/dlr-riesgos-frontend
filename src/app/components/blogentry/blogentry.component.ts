import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ukis-blogentry',
  templateUrl: './blogentry.component.html',
  styleUrls: ['./blogentry.component.scss']
})
export class BlogentryComponent implements OnInit {

  @Input() public title: string;
  @Input() public body: string;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnInit, Input } from '@angular/core';

export interface TableEntry {
  value: string;
  style?: object;
}


@Component({
  selector: 'app-title-table-component',
  templateUrl: './info-table-component.component.html',
  styleUrls: ['./info-table-component.component.scss']
})
export class InfoTableComponentComponent implements OnInit {

  @Input() title: string;
  @Input() topText: string;
  @Input() bottomText: string;
  @Input() data: TableEntry[][];

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-translatable-string',
  templateUrl: './translatable-string.component.html',
  styleUrls: ['./translatable-string.component.scss']
})
export class TranslatableStringComponent implements OnInit {

  @Input() text: string;

  constructor() { }

  ngOnInit(): void {
  }

}

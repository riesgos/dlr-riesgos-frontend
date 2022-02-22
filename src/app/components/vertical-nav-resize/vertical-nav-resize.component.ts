import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from "@angular/core";

@Component({
  selector: "app-vertical-nav-resize",
  templateUrl: "./vertical-nav-resize.component.html",
  styleUrls: ["./vertical-nav-resize.component.scss"],
})
export class VerticalNavResizeComponent implements OnInit {
  @HostBinding("class")
  class = "nav-resize-icon";

  @Input() set width(value: number) {
    if (!this.startWidth) {
      this.startWidth = value;
    }
    this.pivWidth = value;
  }
  get width() {
    return this.pivWidth;
  }

  @Output()
  widthChange = new EventEmitter<number>();

  @Input()
  steps: number = 3;

  @Input() minWidth = 8;
  @Input() maxWidth = 40;


  startWidth = 0;
  protected pivWidth = 0;
  inputStepSize = 0.5;
  toggleStep?: number;

  @Input() slider: boolean = false;
  showSlider = false;

  constructor() { }

  ngOnInit(): void {
    /* this.width = this.startWidth; */
    this.toggleStep = this.maxWidth / this.steps;
    if (this.toggleStep === 0) {
      this.toggleStep = 1;
    }
  }

  setWidth(width?: number | null) {
    if (width) {
      this.width = width;
    }
    this.widthChange.next(this.width);
  }

  resizeToggle(value: "+" | "-") {
    if (this.toggleStep) {
      if (value === "+") {
        const width = this.width + this.toggleStep;
        if (width < this.maxWidth) {
          this.width = width;
        } else if (width >= this.maxWidth) {
          this.width = this.maxWidth;
        }
      } else {
        const width = this.width - this.toggleStep;
        if (width > this.minWidth) {
          this.width = width;
        } else if (width <= this.minWidth) {
          this.width = this.minWidth;
        }
      }
    }
    this.setWidth();
  }
}

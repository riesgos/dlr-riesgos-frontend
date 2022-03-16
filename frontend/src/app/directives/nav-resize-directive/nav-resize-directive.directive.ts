import {
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  Host,
  Input,
  OnDestroy,
  Optional,
  Output,
  Renderer2,
  Self
} from "@angular/core";

import { ClrVerticalNav } from "@clr/angular";
import { Subscription } from "rxjs";


/**
   * https://dev.to/swastikyadav/convert-px-to-rem-an-effective-workflow-4m4j
   * https://stackoverflow.com/a/42769683/10850021
   */
function convertPixelsToRem(px: number) {
  const rem = px /
    parseFloat(getComputedStyle(document.documentElement).fontSize);
  return Math.trunc(rem);
}

@Directive({
  selector: "[appNavResize]",
})
export class NavResizeDirectiveDirective implements OnDestroy {
  direction: "right" | "left" = "left";

  @Input() set width(value: number) {
    this.privWidth = value;
    this.setWidth(this.privWidth);
    // console.log('NavResizeDirectiveDirective set width', value);
  }
  get width() {
    return this.privWidth;
  }

  @Output() widthChange = new EventEmitter<number>();

  @Input() unit = "rem";

  componentRef!: ComponentRef<any>;
  subs: Subscription[] = [];
  privWidth: number = 0;

  constructor(
    private element: ElementRef,
    @Host() @Self() @Optional() public host: ClrVerticalNav,
    private renderer: Renderer2,
  ) {
    /* console.log(this);
    console.log(element.nativeElement.classList);
    console.log(host);
    console.dir(viewRef.element.nativeElement); */

    // console.log(this);
    // console.log(host);

    this.checkClassList();
    if (this.host) {
      const hostSub = this.host["_collapsedChanged"].subscribe((value: any) => {
        if (value === true) {
          this.removeStyle();
        } else {
          this.setWidth(this.privWidth);
        }
      });

      this.subs.push(hostSub);
    }
  }

  checkClassList() {
    const classList: DOMTokenList = this.element.nativeElement.classList;
    if (classList.contains("right")) {
      this.direction = "right";
    } else if (!classList.contains("left")) {
      // no class add left
      this.renderer.addClass(this.element.nativeElement, this.direction);
    }
  }

  setWidth(width: number) {
    if (width) {
      this.privWidth = width;
      this.widthChange.next(this.privWidth);
      this.renderer.setStyle(
        this.element.nativeElement,
        `width`,
        `${this.privWidth}${this.unit}`,
      );
    }
  }

  removeStyle() {
    this.renderer.removeStyle(this.element.nativeElement, "width");
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  /* ngAfterViewInit(): void {
    if (!this.width) {
      const domRect = this.element.nativeElement.getBoundingClientRect();
      const navWidth = convertPixelsToRem(domRect.width);
      this.setWidth(navWidth);
    }
  } */
}

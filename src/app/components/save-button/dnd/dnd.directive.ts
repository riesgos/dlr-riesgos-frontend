import { Directive, HostListener, HostBinding, Output, EventEmitter } from '@angular/core';


@Directive({
  selector: '[ukisDnd]'
})
export class DndDirective {

  @HostBinding('style.background') private background = '#eee';
  @Output() fileDropped = new EventEmitter<Array<File>>();

  constructor() {}

  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.background = '#eee';
      this.fileDropped.emit(files);
    }
  }

}

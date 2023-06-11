import { Component, HostBinding, Input } from '@angular/core';


/**
 * https://medium.com/@rado.sabo/best-way-to-use-svg-icons-in-angular-with-caching-and-possibility-of-changing-colour-71923bb3f189
 */

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.css']
})
export class SvgComponent {
  @HostBinding('style.-webkit-mask-image')
  private _path!: string;

  @Input()
  public set path(filePath: string) {
    this._path = `url("${filePath}")`;
  }
}
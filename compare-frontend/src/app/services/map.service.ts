import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  attachMap(nativeElement: HTMLDivElement) {
    throw new Error('Method not implemented.');
  }
}

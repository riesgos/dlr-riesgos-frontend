import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private storage = window.localStorage;

  constructor() { }

  local(key: string, val?: string): string | boolean {
    if (val) {
      return this.writeLocal(key, val);
    } else {
      return this.readLocal(key);
    }
  }

  readLocal(key: string): string {
    return this.storage.getItem(key);
  }

  writeLocal(key: string, val: string): boolean {
    this.storage.setItem(key, val);
    return true;
  }

}

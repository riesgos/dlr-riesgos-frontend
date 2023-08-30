import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private storage = window.localStorage;

  constructor() {}

  readLocal(key: string): string | null {
    return this.storage.getItem(key);
  }

  writeLocal(key: string, val: string): boolean {
    this.storage.setItem(key, val);
    return true;
  }

}

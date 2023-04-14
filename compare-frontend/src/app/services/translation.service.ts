import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export type Language = "EN" | "ES";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  
  getCurrentLang(): Observable<Language> {
    throw new Error('Method not implemented.');
  }

  syncTranslate(text: string): string {
    throw new Error('Method not implemented.');
  }


  constructor() { }
}

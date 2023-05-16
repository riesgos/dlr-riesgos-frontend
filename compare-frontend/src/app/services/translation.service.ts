import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';


export type Language = "EN" | "ES";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  
  getCurrentLang(): Observable<Language> {
    return of("EN");
  }

  syncTranslate(text: string): string {
    return text;
  }


  constructor() { }
}

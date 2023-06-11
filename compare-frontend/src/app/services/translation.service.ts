import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import dictEs from './dict.es.json';
import dictEn from './dict.en.json';


@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private currentLang$ = new BehaviorSubject<Language>("ES");
  private dicts: { [key in Language]: TranslationDict } = {
    "EN": dictEn,
    "ES": dictEs
  };

  constructor() {}
  
  getCurrentLang(): Observable<Language> {
    return this.currentLang$;
  }

  setCurrentLang(lang: Language) {
    this.currentLang$.next(lang);
  }

  translate(text: string, substitutions: SubstitutionMap = {}): string {
    const parts = this.split(text);
    let fullText = "";
    for (const part of parts) {
      let text = "";
      if (isTemplate(part)) {
        const substituted = this.substitute(part, substitutions);
        text = this.translate(substituted, substitutions);
      } else {
        text = this.translateSubstituted(part);
      }
      fullText += text;
    }
    return fullText;
  }

  private split(text: string): (Template | string)[] {
    const parts: (Template | string)[] = [];

    let currentPart = "";
    for (let i = 0; i < text.length; i++) {
      
      const currentLetter = text[i];
      const nextLetter = text[i+1];
      
      if (currentLetter === "{") {
        if (nextLetter === "{") {
          parts.push(currentPart);
          currentPart = currentLetter + nextLetter;
          i += 1;
        }
      }
      
      else if (currentLetter === "}") {
        if (nextLetter === "}") {
          currentPart += currentLetter
          currentPart += nextLetter;
          parts.push(currentPart);
          currentPart = "";
          i += 1;
        }
      } 
      
      else {
        currentPart += currentLetter;
      }
    }
    if (currentPart !== "") parts.push(currentPart);

    return parts;
  }

  private translateSubstituted(substitutedKey: string): string {
    const dict = this.getDict();
    const result = dict[substitutedKey];
    if (!result) {
      console.warn(`No translation found for ${substitutedKey}`);
      return substitutedKey;
    }
    return result;
  }

  private substitute(text: Template, substitutions: SubstitutionMap): string {
    const key = text.substring(2, -2).trim();
    const substituted = substitutions[key];
    if (!substituted) return key;
    return substituted;
  }

  private getDict(): TranslationDict {
    return this.dicts[this.currentLang$.value];
  }


}


export type Language = "EN" | "ES";

type Template = string;
function isTemplate(str: string): str is Template {
  return str.startsWith("{{") && str.endsWith("}}");
}

type TranslationDict = { [key: string]: string };

type SubstitutionMap = { [key: string]: string };

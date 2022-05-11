import { Injectable } from '@angular/core';
import { HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorParserService {

  constructor() { }

  parse(error: any): string {
      if (typeof error === 'string') {
        return error;
      } else if (typeof error.status !== 'undefined' && error.status !== 200) {
        return this.parseHttpError(error);
      } else if (typeof error.status !== 'undefined' && error.status === 200) {
        return this.parseBodyError(error);
      } else if (typeof error === 'object' && error.message) {
        return 'An error has occured. ' + error.message;
      } else {
        return 'Unknown error';
      }
  }

  private parseHttpError(error: HttpErrorResponse): string {
    if (error.error && typeof error.error === 'string' && error.error.startsWith('<?xml')) {
      return `HTTP-error ${error.status}: ` + this.parseXmlError(error.error);
    }
    return `HTTP-error ${error.status}: ` + error.error || error.message;
  }

  private parseBodyError(error: HttpResponse<any>): string {
    // @TODO: if an error hides behind a url-reference, resolve this reference and read out the error-message.
    if (typeof error.body === 'string') {
      if (error.body.startsWith('<?xml')) {
        return this.parseXmlError(error.body);
      }
      return error.body;
    } else {
      return JSON.stringify(error.body);
    }
  }

  private parseXmlError(xml: string): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const messages = xmlDoc.getElementsByTagName('ows:ExceptionText');
    if (messages && messages.length) {
      return messages[0].childNodes[0].nodeValue;
    } else {
      return xml;
    }
  }
}

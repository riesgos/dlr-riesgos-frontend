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
      } else {
        return 'Unknown error';
      }
  }

  private parseHttpError(error: HttpErrorResponse): string {
    return error.message;
  }

  private parseBodyError(error: HttpResponse<any>): string {
    return error.body;
  }
}

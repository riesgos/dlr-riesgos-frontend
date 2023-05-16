import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { catchError, delay, retry } from "rxjs/operators";


/**
 * In firefox, POST-requests that are too close to each other 
 * are being cancelled with an NS_BINDING_ABORTED error.
 * This interceptor:
 *  - delays posts by a random amount (up to 100 ms) so they are less likely to clump together
 *  - retries posts that have failed 
 * 
 * https://kb.webtrends.com/articles/Information/NS-BINDING-ABORTED-status-message-in-http-debugger/?l=en_US&fs=RelatedArticle
 */

@Injectable()
export class PostSpreadInterceptor implements HttpInterceptor {
    constructor(
        private router: Router
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // https://stackoverflow.com/questions/71340322/rxjs-error-handling-with-catcherror-and-retry
        // https://blog.angular-university.io/rxjs-error-handling/

        if (req.method === 'POST') {
            return next.handle(req).pipe(
                delay(Math.random() * 100),
                retry(2)
            );
        }

        return next.handle(req);
    }
}
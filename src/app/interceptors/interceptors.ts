import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Logging interceptor");

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {

        }
      })
    );
  }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Auth interceptor");

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {

        }
      })
    );
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Error interceptor");

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {

        }
      })
    );
  }
}

@Injectable()
export class WarningInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Warning interceptor");

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {

        }
      })
    );
  }
}


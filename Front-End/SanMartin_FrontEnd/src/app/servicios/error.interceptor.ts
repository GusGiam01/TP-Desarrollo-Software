import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DatabaseDownService } from './db-unavailable.service.js';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dbDownService: DatabaseDownService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 503) {
          this.dbDownService.setDbDown(true); // ⚠️ DB caída
        }
        return throwError(() => error);
      })
    );
  }
}

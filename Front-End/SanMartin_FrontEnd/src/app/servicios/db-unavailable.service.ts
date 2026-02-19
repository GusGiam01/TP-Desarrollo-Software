import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DatabaseDownService {
  private dbDownSubject = new BehaviorSubject<boolean>(false);
  dbDown$ = this.dbDownSubject.asObservable();

  setDbDown(value: boolean) {
    this.dbDownSubject.next(value);
  }
}
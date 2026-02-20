import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(!!sessionStorage.getItem('token'));
  isLogged$ = this.loggedIn.asObservable();

  login(token: string) {
    sessionStorage.setItem('token', token);
    this.loggedIn.next(true);
  }

  logout() {
    sessionStorage.removeItem('token');
    this.loggedIn.next(false);
  }
}
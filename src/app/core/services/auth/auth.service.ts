import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenSubject = new BehaviorSubject<string | null>(null);
  public authToken$ = this.authTokenSubject.asObservable();

  constructor() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.authTokenSubject.next(token);
    }
  }

  login(token: string): void {
    console.log(token)
    if (!token.trim()) {
      throw new Error('Token cannot be empty');
    }
    localStorage.setItem('authToken', token);
    this.authTokenSubject.next(token);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.authTokenSubject.next(null);
  }

  getAuthToken(): string | null {
    return this.authTokenSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.authTokenSubject.value;
  }
}

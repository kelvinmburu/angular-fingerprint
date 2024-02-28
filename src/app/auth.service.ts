import { Injectable } from '@angular/core';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { LoginResponse } from './login-response';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [];

  constructor(private http: HttpClient) { }

  signup(username: string, password: string, fingerprintId: string) {
    return this.http.post('http://localhost:3000/signup', { username, password, fingerprintId }); 
  }

  login(username: string, password: string): Observable<boolean> {
    
    // Backend Login
    return this.http.post<LoginResponse>('http://localhost:3000/login', { username, password })
      .pipe(
        map(response => {
          console.log('Login responses:', response)
          return response.success}),
        catchError(error => {
          console.error('Login error:', error);
          return of(false);
        })
      );
  }

  logout() {
    this.users = [];
  }

  isLoggedIn(): boolean { 
    return this.users.length > 0; 
   } 
}

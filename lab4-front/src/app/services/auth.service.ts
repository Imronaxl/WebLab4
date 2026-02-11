import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api/auth';
  private tokenKey = 'auth_token';
  private usernameKey = 'username';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  
  constructor(private http: HttpClient) {}
  
  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUsername(response.username);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }
  
  register(request: AuthRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, request);
  }
  
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    this.isAuthenticatedSubject.next(false);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }
  
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
  
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  
  private setUsername(username: string): void {
    localStorage.setItem(this.usernameKey, username);
  }
  
  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}

// src/app/services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, of, timer } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      const savedUser = localStorage.getItem('current_user');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  // Handle errors from the API cleanly
  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred!';
    if (error.error && typeof error.error === 'object') {
      const firstKey = Object.keys(error.error)[0];
      if (firstKey && Array.isArray(error.error[firstKey])) {
        errorMsg = `${firstKey}: ${error.error[firstKey][0]}`;
      } else if (error.error.detail) {
        errorMsg = error.error.detail;
      }
    }
    console.error('API Error:', errorMsg, error);
    return throwError(() => new Error(errorMsg));
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<{ access: string; refresh: string }>(`${this.apiUrl}/login/`, {
      username,
      password
    }).pipe(
      switchMap(tokens => {
        if (this.isBrowser) {
          localStorage.setItem('access', tokens.access);
          localStorage.setItem('refresh', tokens.refresh);
        }
        return this.fetchMe();
      }),
      catchError(err => this.handleError(err))
    );
  }

  register(
    username: string,
    email: string,
    password: string,
    firstName: string = '',
    lastName: string = '',
    role: 'user' | 'organizer' = 'user'
  ): Observable<User> {
    return this.http.post(`${this.apiUrl}/signup/`, {
      username,
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      role: role // Backend should ideally handle this, passing it anyway
    }).pipe(
      switchMap(() => {
        // Wait 500ms before logging in to ensure DB completely saves
        return timer(500).pipe(switchMap(() => this.login(username, password)));
      }),
      catchError(err => this.handleError(err))
    );
  }

  fetchMe(): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/me/`).pipe(
      map(data => {
        const user: User = {
          id: data.id,
          email: data.email,
          name: data.first_name && data.last_name
            ? `${data.first_name} ${data.last_name}`
            : data.username,
          role: data.is_staff ? 'organizer' : 'user',
          avatar: `https://randomuser.me/api/portraits/men/${data.id % 100}.jpg`,
          createdAt: new Date().toISOString()
        };
        this.currentUserSubject.next(user);
        if (this.isBrowser) {
          localStorage.setItem('current_user', JSON.stringify(user));
        }
        return user;
      })
    );
  }

  logout(): Observable<any> {
    const refresh = this.isBrowser ? localStorage.getItem('refresh') : null;
    this.clearLocalAuth();
    
    if (refresh) {
      return this.http.post(`${this.apiUrl}/logout/`, { refresh }).pipe(
        tap(() => this.router.navigate(['/tours'])),
        catchError(() => {
          this.router.navigate(['/tours']);
          return of(null);
        })
      );
    }

    this.router.navigate(['/tours']);
    return of(null);
  }

  forceLogout(): void {
    this.clearLocalAuth();
    this.router.navigate(['/tours']);
  }

  private clearLocalAuth(): void {
    this.currentUserSubject.next(null);
    if (this.isBrowser) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      localStorage.removeItem('current_user');
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('access') && !!this.currentUserSubject.value;
  }

  isOrganizer(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.role === 'organizer';
  }
}
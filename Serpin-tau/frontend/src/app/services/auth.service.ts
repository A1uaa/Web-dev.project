import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { DbService } from './db.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private dbService: DbService,
    private router: Router,
    private http: HttpClient
  ) {
    const user = this.dbService.getCurrentUser();
    this.currentUserSubject.next(user);
  }

  login(email: string, password: string) {
    return this.http.post<any>('http://127.0.0.1:8000/auth/login/', {
      username: email,
      password: password
    }).pipe(
      tap((res) => {
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);

        const users = this.dbService.getUsers();
        const user = users.find(u => u.email === email) || null;

        if (user) {
          this.dbService.setCurrentUser(user);
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  register(name: string, email: string, password: string, role: 'user' | 'organizer' = 'user'): boolean {
    const existingUser = this.dbService.getUsers().find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser = this.dbService.createUser({ name, email, role });
    this.dbService.setCurrentUser(newUser);
    this.currentUserSubject.next(newUser);
    return true;
  }

  logout() {
    const refresh = localStorage.getItem('refresh');

    return this.http.post<any>('http://127.0.0.1:8000/auth/logout/', {
      refresh: refresh
    }).pipe(
      tap(() => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        this.dbService.setCurrentUser(null);
        this.currentUserSubject.next(null);
        this.router.navigate(['/tours']);
      })
    );
  }

  forceLogout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    this.dbService.setCurrentUser(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/tours']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access');
  }

  isOrganizer(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.role === 'organizer';
  }
}
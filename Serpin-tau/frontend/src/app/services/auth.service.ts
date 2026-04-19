// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { DbService } from './db.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private dbService: DbService, private router: Router) {
    const user = this.dbService.getCurrentUser();
    console.log('AuthService init - user from DB:', user);
    this.currentUserSubject.next(user);
  }

  login(email: string, password: string): boolean {
    const users = this.dbService.getUsers();
    const user = users.find(u => u.email === email);
    
    if (user) {
      console.log('Login - user found:', user);
      this.dbService.setCurrentUser(user);
      this.currentUserSubject.next(user);
      return true;
    }
    console.log('Login - user not found');
    return false;
  }

  register(name: string, email: string, password: string, role: 'user' | 'organizer' = 'user'): boolean {
    const existingUser = this.dbService.getUsers().find(u => u.email === email);
    if (existingUser) {
      console.log('Register - email already exists:', email);
      return false;
    }
    
    console.log('Register - creating user with role:', role);
    const newUser = this.dbService.createUser({ name, email, role });
    console.log('Register - new user created:', newUser);
    
    this.dbService.setCurrentUser(newUser);
    this.currentUserSubject.next(newUser);
    
    // Дополнительная проверка
    const verifyUser = this.dbService.getCurrentUser();
    console.log('Register - verified current user:', verifyUser);
    
    return true;
  }

  logout(): void {
    this.dbService.setCurrentUser(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/tours']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isOrganizer(): boolean {
    const user = this.currentUserSubject.value;
    console.log('isOrganizer check - current user:', user);
    console.log('isOrganizer check - role:', user?.role);
    console.log('isOrganizer check - result:', user?.role === 'organizer');
    return user !== null && user.role === 'organizer';
  }
}
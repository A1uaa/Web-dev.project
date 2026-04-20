import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizerGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();

    console.log('GUARD USER:', user);

    if (user && user.role === 'organizer') {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
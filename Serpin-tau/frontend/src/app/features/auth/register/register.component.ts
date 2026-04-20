// src/app/features/auth/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  selectedRole: 'user' | 'organizer' = 'user';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    if (!this.username.trim()) {
      this.error = 'Username is required';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(
      this.username,
      this.email,
      this.password,
      this.firstName,
      this.lastName,
      this.selectedRole
    ).subscribe({
      next: (user) => {
        this.loading = false;
        this.router.navigate(['/tours']);
      },
      error: (err: Error) => {
        this.loading = false;
        this.error = err.message || 'Registration failed. Please try again.';
      }
    });
  }
}
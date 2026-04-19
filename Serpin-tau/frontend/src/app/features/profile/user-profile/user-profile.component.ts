// src/app/features/profile/user-profile/user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PostService } from '../../../services/post.service';
import { TourService } from '../../../services/tour.service';
import { User } from '../../../models/user.model';
import { Post } from '../../../models/post.model';
import { Booking } from '../../../models/booking.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  userPosts: Post[] = [];
  userBookings: Booking[] = [];
  activeTab: 'posts' | 'bookings' = 'posts';

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private tourService: TourService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.userPosts = this.postService.getPostsByUser(this.user.id);
    }
  }
}
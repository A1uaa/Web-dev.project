import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { AuthService } from '../../../services/auth.service';
import { Tour } from '../../../services/db.service';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.scss']
})
export class TourDetailComponent implements OnInit {
  tour: Tour | undefined;
  selectedDate = '';
  successMessage = '';
  errorMessage = '';
  currentRating = 0;
  hoverRating = 0;
  userHasRated = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public tourService: TourService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tour = this.tourService.getTour(id);
    if (!this.tour) {
      this.router.navigate(['/tours']);
    }
    this.loadUserRating();
  }

  registerForTour(): void {
    if (!this.authService.getCurrentUser()) {
      this.router.navigate(['/login']);
    }

    if (!this.selectedDate) {
      this.errorMessage = 'Please select a date';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }

    const user = this.authService.getCurrentUser();
    if (user && this.tour) {
      const currentBookings = this.tour.dateBookings?.[this.selectedDate] || 0;
      const maxBookings = this.tour.dateMaxBookings?.[this.selectedDate] || this.tour.maxBookings;
      
      if (currentBookings >= maxBookings) {
        this.errorMessage = 'This date is fully booked';
        setTimeout(() => this.errorMessage = '', 3000);
        return;
      }
      
      this.tourService.bookTourByDate(user.id, user.name, this.tour.id, this.selectedDate);
      this.successMessage = `Successfully registered for ${this.selectedDate}!`;
      setTimeout(() => this.successMessage = '', 3000);
      
      if (!this.tour.dateBookings) this.tour.dateBookings = {};
      this.tour.dateBookings[this.selectedDate] = (this.tour.dateBookings[this.selectedDate] || 0) + 1;
    }
  }

  selectDate(date: string): void {
    this.selectedDate = date;
    this.errorMessage = '';
  }

  getAvailableSpots(date: string): number {
    if (!this.tour) return 0;
    const booked = this.tour.dateBookings?.[date] || 0;
    const max = this.tour.dateMaxBookings?.[date] || this.tour.maxBookings;
    return max - booked;
  }

  isDateFullyBooked(date: string): boolean {
    return this.getAvailableSpots(date) <= 0;
  }

  loadUserRating(): void {
    if (!this.authService.isLoggedIn() || !this.tour) return;
    
    const user = this.authService.getCurrentUser();
    const ratingsKey = `tour_ratings_${this.tour.id}`;
    const savedRatings = localStorage.getItem(ratingsKey);
    
    if (savedRatings && user) {
      const ratings = JSON.parse(savedRatings);
      if (ratings[user.id]) {
        this.currentRating = ratings[user.id];
        this.userHasRated = true;
      }
    }
  }

  setRating(rating: number): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (this.userHasRated || !this.tour) {
      return;
    }
    
    const user = this.authService.getCurrentUser();
    if (!user) return;
    
    const ratingsKey = `tour_ratings_${this.tour.id}`;
    const savedRatings = localStorage.getItem(ratingsKey);
    const ratings = savedRatings ? JSON.parse(savedRatings) : {};
    
    ratings[user.id] = rating;
    localStorage.setItem(ratingsKey, JSON.stringify(ratings));
    
    const allRatings = Object.values(ratings) as number[];
    const averageRating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
    
    this.tour.rating = Math.round(averageRating * 10) / 10;
    this.tour.reviews = allRatings.length;
    this.tourService.updateTour(this.tour.id, { 
      rating: this.tour.rating, 
      reviews: this.tour.reviews 
    });
    
    this.currentRating = rating;
    this.userHasRated = true;
    this.hoverRating = 0;
  }
}
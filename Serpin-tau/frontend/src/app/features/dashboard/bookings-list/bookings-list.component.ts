// src/app/features/dashboard/bookings-list/bookings-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../../services/tour.service';
import { AuthService } from '../../../services/auth.service';
import { DbService } from '../../../services/db.service';
import { Booking } from '../../../models/booking.model';
import { Tour } from '../../../models/tour.model';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.scss']
})
export class BookingsListComponent implements OnInit {
  bookings: Booking[] = [];
  tours: Tour[] = [];
  selectedTourId: number | null = null;

  constructor(
    private tourService: TourService,
    private authService: AuthService,
    private dbService: DbService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.tours = this.tourService.getToursByOrganizer(user.id);
      this.loadBookings();
    }
  }

  loadBookings(): void {
    let allBookings = this.dbService.getBookings();
    
    if (this.selectedTourId) {
      allBookings = allBookings.filter(b => b.tourId === this.selectedTourId);
    } else if (this.tours.length > 0) {
      const tourIds = this.tours.map(t => t.id);
      allBookings = allBookings.filter(b => tourIds.includes(b.tourId));
    }
    
    this.bookings = allBookings;
  }

  onTourChange(): void {
    this.loadBookings();
  }

  updateStatus(booking: Booking, status: 'confirmed' | 'cancelled'): void {
    booking.status = status;
    this.loadBookings();
  }
}
import { Injectable } from '@angular/core';
import { DbService } from './db.service';
import { Tour, Booking } from './db.service';

@Injectable({ providedIn: 'root' })
export class TourService {
  constructor(private dbService: DbService) {}

  getTours(): Tour[] {
    return this.dbService.getTours();
  }

  getTour(id: number): Tour | undefined {
    return this.dbService.getTour(id);
  }

  createTour(tour: Partial<Tour>): Tour {
    return this.dbService.createTour(tour);
  }

  updateTour(id: number, updates: Partial<Tour>): void {
    this.dbService.updateTour(id, updates);
  }

  deleteTour(id: number): void {
    this.dbService.deleteTour(id);
  }

  getToursByOrganizer(organizerId: number): Tour[] {
    return this.dbService.getTours().filter(t => t.organizerId === organizerId);
  }

  getBookingsByUser(userId: number): Booking[] {
    return this.dbService.getBookingsByUser(userId);
  }

  cancelBooking(bookingId: number): void {
    this.dbService.cancelBooking(bookingId);
  }

  bookTourByDate(userId: number, userName: string, tourId: number, selectedDate: string): void {
    const tour = this.getTour(tourId);
    
    if (tour) {
      if (!tour.dateBookings) {
        tour.dateBookings = {};
      }
      if (!tour.dateBookings[selectedDate]) {
        tour.dateBookings[selectedDate] = 0;
      }
      tour.dateBookings[selectedDate]++;
      
      tour.bookings = Object.values(tour.dateBookings).reduce((a, b) => a + b, 0);
      
      this.updateTour(tourId, { 
        dateBookings: tour.dateBookings,
        bookings: tour.bookings
      });
      
      this.dbService.createBooking({
        userId, 
        tourId, 
        userName: userName, 
        tourTitle: tour.title,
        selectedDate: selectedDate,
        status: 'confirmed'
      });
    }
  }

  bookTour(userId: number, userName: string, tourId: number): void {
    const tour = this.getTour(tourId);
    
    if (tour) {
      tour.bookings++;
      this.updateTour(tourId, { bookings: tour.bookings });
      
      this.dbService.createBooking({
        userId, 
        tourId, 
        userName: userName, 
        tourTitle: tour.title,
        status: 'confirmed'
      });
    }
  }
}
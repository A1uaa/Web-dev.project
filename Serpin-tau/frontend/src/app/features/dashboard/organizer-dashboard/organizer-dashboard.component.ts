// src/app/features/dashboard/organizer-dashboard/organizer-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { AuthService } from '../../../services/auth.service';
import { Tour } from '../../../models/tour.model';

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],  
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.scss']
})
export class OrganizerDashboardComponent implements OnInit {
  myTours: Tour[] = [];
  totalBookings = 0;
  upcomingTours = 0;
  activeTab: 'tours' | 'bookings' = 'tours';
  searchTerm = '';
  filterStatus = 'all';

  constructor(
    private tourService: TourService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.myTours = this.tourService.getToursByOrganizer(user.id);
      this.totalBookings = this.myTours.reduce((sum, tour) => sum + tour.bookings, 0);
      this.upcomingTours = this.myTours.filter(tour => tour.bookings < tour.maxBookings).length;
    }
  }

  get filteredTours(): Tour[] {
    let tours = this.myTours;
    
    if (this.searchTerm) {
      tours = tours.filter(tour => 
        tour.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    if (this.filterStatus === 'available') {
      tours = tours.filter(tour => tour.bookings < tour.maxBookings);
    } else if (this.filterStatus === 'full') {
      tours = tours.filter(tour => tour.bookings >= tour.maxBookings);
    }
    
    return tours;
  }

  deleteTour(id: number): void {
    if (confirm('Are you sure you want to delete this tour?')) {
      this.tourService.deleteTour(id);
      this.myTours = this.myTours.filter(t => t.id !== id);
    }
  }
}
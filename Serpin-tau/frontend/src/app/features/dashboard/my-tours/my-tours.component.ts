// src/app/features/dashboard/my-tours/my-tours.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { AuthService } from '../../../services/auth.service';
import { Tour } from '../../../models/tour.model';

@Component({
  selector: 'app-my-tours',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './my-tours.component.html',
  styleUrls: ['./my-tours.component.scss']
})
export class MyToursComponent implements OnInit {
  myTours: Tour[] = [];
  searchTerm = '';

  constructor(
    private tourService: TourService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.myTours = this.tourService.getToursByOrganizer(user.id);
    }
  }

  get filteredTours(): Tour[] {
    if (!this.searchTerm) return this.myTours;
    return this.myTours.filter(tour => 
      tour.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteTour(id: number): void {
    if (confirm('Are you sure you want to delete this tour?')) {
      this.tourService.deleteTour(id);
      this.myTours = this.myTours.filter(t => t.id !== id);
    }
  }
}
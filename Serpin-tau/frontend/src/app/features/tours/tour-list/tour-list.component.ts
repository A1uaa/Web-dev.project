// src/app/features/tours/tour-list/tour-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { AuthService } from '../../../services/auth.service';
import { Tour } from '../../../models/tour.model';
import { TourCardComponent } from '../tour-card/tour-card.component';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TourCardComponent],
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.scss']
})
export class TourListComponent implements OnInit {
  tours: Tour[] = [];
  filteredTours: Tour[] = [];
  searchTerm = '';
  selectedDifficulty = '';
  sortBy = 'popular';
  selectedPriceRange = 'all';

  difficulties = ['Easy', 'Moderate', 'Challenging'];
  sortOptions = [
    { value: 'popular', label: 'Popular' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'duration', label: 'Duration' }
  ];

  constructor(
    private tourService: TourService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.tours = this.tourService.getTours();
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onDifficultyChange(difficulty: string): void {
    this.selectedDifficulty = difficulty;
    this.applyFilters();
  }

  onPriceChange(priceRange: string): void {
    this.selectedPriceRange = priceRange;
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTours = this.tours.filter(tour => {
      const matchesSearch = tour.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           tour.location.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesDifficulty = !this.selectedDifficulty || tour.difficulty === this.selectedDifficulty;
      
      let matchesPrice = true;
      if (this.selectedPriceRange === '0-200') {
        matchesPrice = tour.price <= 200;
      } else if (this.selectedPriceRange === '200-500') {
        matchesPrice = tour.price >= 200 && tour.price <= 500;
      } else if (this.selectedPriceRange === '500+') {
        matchesPrice = tour.price >= 500;
      }
      
      return matchesSearch && matchesDifficulty && matchesPrice;
    });

    this.sortTours();
  }

  sortTours(): void {
    switch(this.sortBy) {
      case 'price_low':
        this.filteredTours.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        this.filteredTours.sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        this.filteredTours.sort((a, b) => a.duration - b.duration);
        break;
      default:
        this.filteredTours.sort((a, b) => b.rating - a.rating);
    }
  }

  onSortChange(): void {
    this.sortTours();
  }
}
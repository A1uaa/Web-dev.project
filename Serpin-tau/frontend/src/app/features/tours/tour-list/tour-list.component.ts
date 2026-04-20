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

  // теперь можно выбирать несколько difficulty
  selectedDifficulties: string[] = [];

  // теперь можно выбирать несколько duration
  selectedDurations: string[] = [];

  sortBy = 'popular';
  selectedPriceRange = 'all';

  difficulties = ['Easy', 'Moderate', 'Challenging'];
  durationOptions = ['1-3', '4-7', '8+'];

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

  toggleDifficulty(difficulty: string): void {
    if (this.selectedDifficulties.includes(difficulty)) {
      this.selectedDifficulties = this.selectedDifficulties.filter(d => d !== difficulty);
    } else {
      this.selectedDifficulties = [...this.selectedDifficulties, difficulty];
    }

    this.applyFilters();
  }

  toggleDuration(duration: string): void {
    if (this.selectedDurations.includes(duration)) {
      this.selectedDurations = this.selectedDurations.filter(d => d !== duration);
    } else {
      this.selectedDurations = [...this.selectedDurations, duration];
    }

    this.applyFilters();
  }

  onPriceChange(priceRange: string): void {
    this.selectedPriceRange = priceRange;
    this.applyFilters();
  }

  matchesDuration(durationValue: number): boolean {
    if (this.selectedDurations.length === 0) {
      return true;
    }

    return this.selectedDurations.some(duration => {
      if (duration === '1-3') {
        return durationValue >= 1 && durationValue <= 3;
      }

      if (duration === '4-7') {
        return durationValue >= 4 && durationValue <= 7;
      }

      if (duration === '8+') {
        return durationValue >= 8;
      }

      return false;
    });
  }

  applyFilters(): void {
    this.filteredTours = this.tours.filter(tour => {
      const matchesSearch =
        tour.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        tour.location.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesDifficulty =
        this.selectedDifficulties.length === 0 ||
        this.selectedDifficulties.includes(tour.difficulty);

      const matchesDuration = this.matchesDuration(tour.duration);

      let matchesPrice = true;

      if (this.selectedPriceRange === '0-200') {
        matchesPrice = tour.price <= 200;
      } else if (this.selectedPriceRange === '200-500') {
        matchesPrice = tour.price >= 200 && tour.price <= 500;
      } else if (this.selectedPriceRange === '500+') {
        matchesPrice = tour.price >= 500;
      }

      return matchesSearch && matchesDifficulty && matchesDuration && matchesPrice;
    });

    this.sortTours();
  }

  sortTours(): void {
    switch (this.sortBy) {
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

  isDifficultySelected(difficulty: string): boolean {
    return this.selectedDifficulties.includes(difficulty);
  }

  isDurationSelected(duration: string): boolean {
    return this.selectedDurations.includes(duration);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDifficulties = [];
    this.selectedDurations = [];
    this.selectedPriceRange = 'all';
    this.sortBy = 'popular';
    this.applyFilters();
  }
}
// src/app/features/tours/tour-filters/tour-filters.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tour-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],  
  templateUrl: './tour-filters.component.html',
  styleUrls: ['./tour-filters.component.scss']
})
export class TourFiltersComponent {
  @Output() filtersChanged = new EventEmitter<any>();
  
  priceRange: string = 'all';
  selectedDifficulties: string[] = [];
  selectedDurations: string[] = [];
  
  difficulties = ['Easy', 'Moderate', 'Challenging'];
  durations = ['1-3 Days', '4-7 Days', '8+ Days'];

  onDifficultyChange(difficulty: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedDifficulties.push(difficulty);
    } else {
      this.selectedDifficulties = this.selectedDifficulties.filter(d => d !== difficulty);
    }
    this.emitFilters();
  }

  onDurationChange(duration: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedDurations.push(duration);
    } else {
      this.selectedDurations = this.selectedDurations.filter(d => d !== duration);
    }
    this.emitFilters();
  }

  onPriceChange(price: string): void {
    this.priceRange = price;
    this.emitFilters();
  }

  emitFilters(): void {
    this.filtersChanged.emit({
      priceRange: this.priceRange,
      difficulties: this.selectedDifficulties,
      durations: this.selectedDurations
    });
  }

  resetFilters(): void {
    this.priceRange = 'all';
    this.selectedDifficulties = [];
    this.selectedDurations = [];
    this.emitFilters();
  }
}
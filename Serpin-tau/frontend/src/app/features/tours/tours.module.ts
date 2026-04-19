// src/app/features/tours/tours.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TourListComponent } from './tour-list/tour-list.component';
import { TourCardComponent } from './tour-card/tour-card.component';
import { TourDetailComponent } from './tour-detail/tour-detail.component';
import { TourFormComponent } from './tour-form/tour-form.component';
import { TourFiltersComponent } from './tour-filters/tour-filters.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TourListComponent,
    TourCardComponent,
    TourDetailComponent,
    TourFormComponent,
    TourFiltersComponent
  ],
  exports: [
    TourCardComponent,
    TourFiltersComponent
  ]
})
export class ToursModule { }
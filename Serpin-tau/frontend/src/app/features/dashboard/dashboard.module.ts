// src/app/features/dashboard/dashboard.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrganizerDashboardComponent } from './organizer-dashboard/organizer-dashboard.component';
import { MyToursComponent } from './my-tours/my-tours.component';
import { BookingsListComponent } from './bookings-list/bookings-list.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    OrganizerDashboardComponent,
    MyToursComponent,
    BookingsListComponent
  ]
})
export class DashboardModule { }
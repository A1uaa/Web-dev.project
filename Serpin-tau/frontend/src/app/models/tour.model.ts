// src/app/models/tour.model.ts
export interface Tour {
  id: number;
  title: string;
  location: string;
  description: string;
  price: number;
  duration: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  dates: string[];
  images: string[];
  rating: number;
  reviews: number;
  highlights: string[];
  organizerId: number;
  organizerName: string;
  bookings: number;
  maxBookings: number;
}
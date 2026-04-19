// src/app/models/booking.model.ts
export interface Booking {
  id: number;
  userId: number;
  tourId: number;
  userName: string;
  tourTitle: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  registeredAt: string;
}
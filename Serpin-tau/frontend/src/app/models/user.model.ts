// src/app/models/user.model.ts
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'guest' | 'user' | 'organizer';  
  avatar?: string;
  bio?: string;
  createdAt?: string;
}
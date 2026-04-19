import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'guest' | 'user' | 'organizer';
  avatar?: string;
  bio?: string;
  createdAt?: string;
}

export interface Tour {
  id: number;
  title: string;
  location: string;
  description: string;
  price: number;
  duration: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  dates: string[];
  dateBookings: { [date: string]: number };
  dateMaxBookings: { [date: string]: number };
  images: string[];
  rating: number;
  reviews: number;
  highlights: string[];
  organizerId: number;
  organizerName: string;
  bookings: number;
  maxBookings: number;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  createdAt: string;
  likes: number;
  comments: number;
}

export interface Booking {
  id: number;
  userId: number;
  tourId: number;
  userName: string;
  tourTitle: string;
  selectedDate?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  registeredAt: string;
}

@Injectable({ providedIn: 'root' })
export class DbService {
  private readonly KEYS = {
    USERS: 'mt_users',
    TOURS: 'mt_tours',
    POSTS: 'mt_posts',
    BOOKINGS: 'mt_bookings',
    CURRENT_USER: 'mt_current_user'
  };

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.initMockData();
    }
  }

  private initMockData(): void {
    if (!this.isBrowser) return;
    
    if (!localStorage.getItem(this.KEYS.USERS)) {
      const users: User[] = [
        { id: 1, email: 'user@test.com', name: 'Sarah Parker', role: 'user', avatar: 'https://randomuser.me/api/portraits/women/1.jpg', createdAt: new Date().toISOString() },
        { id: 2, email: 'organizer@test.com', name: 'Emma Brown', role: 'organizer', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', createdAt: new Date().toISOString() },
        { id: 3, email: 'mark@test.com', name: 'Mark Stevens', role: 'user', avatar: 'https://randomuser.me/api/portraits/men/3.jpg', createdAt: new Date().toISOString() }
      ];
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    }

    if (!localStorage.getItem(this.KEYS.TOURS)) {
      const tours: Tour[] = [
        {
          id: 1, title: 'Kolsai Lakes Trek', location: 'Kazakhstan',
          description: 'Discover the pristine mountain lakes surrounded by lush forests and majestic peaks.',
          price: 250, duration: 3, difficulty: 'Easy',
          dates: ['June 20 – June 22', 'July 5 – July 7', 'August 15 – August 17'],
          dateBookings: { 'June 20 – June 22': 5, 'July 5 – July 7': 3, 'August 15 – August 17': 1 },
          dateMaxBookings: { 'June 20 – June 22': 15, 'July 5 – July 7': 15, 'August 15 – August 17': 15 },
          images: ['https://picsum.photos/id/96/800/500'],
          rating: 4.9, reviews: 45,
          highlights: ['Camping by the lake', 'Local guide', 'Traditional meals'],
          organizerId: 2, organizerName: 'Emma Brown', bookings: 9, maxBookings: 15
        },
        {
          id: 2, title: 'Kaindy Lake Expedition', location: 'Kazakhstan',
          description: 'Visit the stunning submerged forest lake - Kaindy.',
          price: 280, duration: 2, difficulty: 'Moderate',
          dates: ['July 10 – July 12', 'August 1 – August 3'],
          dateBookings: { 'July 10 – July 12': 8, 'August 1 – August 3': 4 },
          dateMaxBookings: { 'July 10 – July 12': 20, 'August 1 – August 3': 20 },
          images: ['https://picsum.photos/id/15/800/500'],
          rating: 4.8, reviews: 38,
          highlights: ['Submerged forest viewing', 'Kayaking', 'Camping'],
          organizerId: 2, organizerName: 'Emma Brown', bookings: 12, maxBookings: 20
        },
        {
          id: 3, title: 'Charyn Canyon Adventure', location: 'Kazakhstan',
          description: 'Explore the majestic Charyn Canyon.',
          price: 180, duration: 2, difficulty: 'Easy',
          dates: ['June 25 – June 26', 'July 20 – July 21', 'August 10 – August 11'],
          dateBookings: { 'June 25 – June 26': 12, 'July 20 – July 21': 6, 'August 10 – August 11': 0 },
          dateMaxBookings: { 'June 25 – June 26': 25, 'July 20 – July 21': 25, 'August 10 – August 11': 25 },
          images: ['https://picsum.photos/id/29/800/500'],
          rating: 4.7, reviews: 52,
          highlights: ['Valley of Castles', 'Hiking trails', 'Picnic lunch'],
          organizerId: 2, organizerName: 'Emma Brown', bookings: 18, maxBookings: 25
        }
      ];
      localStorage.setItem(this.KEYS.TOURS, JSON.stringify(tours));
    }

    if (!localStorage.getItem(this.KEYS.POSTS)) {
      const posts: Post[] = [
        { id: 1, title: 'Amazing Kolsai Lakes', content: 'Just returned from Kolsai Lakes! The views were absolutely breathtaking.', image: 'https://picsum.photos/id/29/600/400', authorId: 1, authorName: 'Sarah Parker', authorAvatar: 'https://randomuser.me/api/portraits/women/1.jpg', createdAt: new Date().toISOString(), likes: 24, comments: 5 }
      ];
      localStorage.setItem(this.KEYS.POSTS, JSON.stringify(posts));
    }

    if (!localStorage.getItem(this.KEYS.BOOKINGS)) {
      localStorage.setItem(this.KEYS.BOOKINGS, JSON.stringify([]));
    }
  }

  getUsers(): User[] { 
    if (!this.isBrowser) return [];
    const data = localStorage.getItem(this.KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }
  
  getUser(id: number): User | undefined { 
    return this.getUsers().find(u => u.id === id); 
  }
  
  createUser(userData: Partial<User>): User {
    const users = this.getUsers();
    const newUser: User = { 
      id: Date.now(), 
      email: userData.email || '',
      name: userData.name || '',
      role: userData.role || 'user',
      avatar: userData.avatar || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    return newUser;
  }

  getTours(): Tour[] { 
    if (!this.isBrowser) return [];
    const data = localStorage.getItem(this.KEYS.TOURS);
    return data ? JSON.parse(data) : [];
  }
  
  getTour(id: number): Tour | undefined { 
    return this.getTours().find(t => t.id === id); 
  }
  
  createTour(tourData: Partial<Tour>): Tour {
    const tours = this.getTours();
    const newTour: Tour = { 
      ...tourData as any,
      id: Date.now(), 
      bookings: 0, 
      rating: 0, 
      reviews: 0,
      dateBookings: {},
      dateMaxBookings: {}
    } as Tour;
    tours.push(newTour);
    localStorage.setItem(this.KEYS.TOURS, JSON.stringify(tours));
    return newTour;
  }
  
  updateTour(id: number, updates: Partial<Tour>): void {
    const tours = this.getTours();
    const index = tours.findIndex(t => t.id === id);
    if (index !== -1) {
      tours[index] = { ...tours[index], ...updates };
      localStorage.setItem(this.KEYS.TOURS, JSON.stringify(tours));
    }
  }
  
  deleteTour(id: number): void {
    const tours = this.getTours().filter(t => t.id !== id);
    localStorage.setItem(this.KEYS.TOURS, JSON.stringify(tours));
  }

  getPosts(): Post[] { 
    if (!this.isBrowser) return [];
    const data = localStorage.getItem(this.KEYS.POSTS);
    return data ? JSON.parse(data) : [];
  }
  
  getPost(id: number): Post | undefined { 
    return this.getPosts().find(p => p.id === id); 
  }
  
  createPost(postData: Partial<Post>): Post {
    const posts = this.getPosts();
    const newPost: Post = { 
      ...postData as any,
      id: Date.now(), 
      likes: 0, 
      comments: 0, 
      createdAt: new Date().toISOString() 
    } as Post;
    posts.unshift(newPost);
    localStorage.setItem(this.KEYS.POSTS, JSON.stringify(posts));
    return newPost;
  }
  
  likePost(id: number): void {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === id);
    if (post) { 
      post.likes++; 
      localStorage.setItem(this.KEYS.POSTS, JSON.stringify(posts)); 
    }
  }
  
  unlikePost(id: number): void {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === id);
    if (post && post.likes > 0) { 
      post.likes--; 
      localStorage.setItem(this.KEYS.POSTS, JSON.stringify(posts)); 
    }
  }

  getBookings(): Booking[] { 
    if (!this.isBrowser) return [];
    const data = localStorage.getItem(this.KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  }
  
  createBooking(bookingData: Partial<Booking>): Booking {
    const bookings = this.getBookings();
    const newBooking: Booking = { 
      ...bookingData as any,
      id: Date.now(), 
      registeredAt: new Date().toISOString(), 
      status: 'confirmed' 
    } as Booking;
    bookings.push(newBooking);
    localStorage.setItem(this.KEYS.BOOKINGS, JSON.stringify(bookings));
    return newBooking;
  }

  getCurrentUser(): User | null {
    if (!this.isBrowser) return null;
    const data = localStorage.getItem(this.KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }
  
  setCurrentUser(user: User | null): void {
    if (!this.isBrowser) return;
    if (user) localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(this.KEYS.CURRENT_USER);
  }
}
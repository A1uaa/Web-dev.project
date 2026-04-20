import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './interceptors/auth.interceptor';

import { TourListComponent } from './features/tours/tour-list/tour-list.component';
import { TourDetailComponent } from './features/tours/tour-detail/tour-detail.component';
import { TourFormComponent } from './features/tours/tour-form/tour-form.component';
import { PostListComponent } from './features/posts/post-list/post-list.component';
import { PostFormComponent } from './features/posts/post-form/post-form.component';
import { PostDetailComponent } from './features/posts/post-detail/post-detail.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { OrganizerDashboardComponent } from './features/dashboard/organizer-dashboard/organizer-dashboard.component';
import { UserProfileComponent } from './features/profile/user-profile/user-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { OrganizerGuard } from './guards/organizer.guard';
import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/tours', pathMatch: 'full' },
  { path: 'tours', component: TourListComponent },
  { path: 'tours/:id', component: TourDetailComponent },
  { path: 'create-tour', component: TourFormComponent, canActivate: [AuthGuard, OrganizerGuard] },
  { path: 'edit-tour/:id', component: TourFormComponent, canActivate: [AuthGuard, OrganizerGuard] },
  { path: 'posts', component: PostListComponent },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: 'create-post', component: PostFormComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: OrganizerDashboardComponent, canActivate: [AuthGuard, OrganizerGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/tours' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    provideAnimations(),
  ]
};

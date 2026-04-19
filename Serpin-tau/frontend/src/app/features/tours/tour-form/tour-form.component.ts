// src/app/features/tours/tour-form/tour-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-tour-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './tour-form.component.html',
  styleUrls: ['./tour-form.component.scss']
})
export class TourFormComponent implements OnInit {
  tourForm: FormGroup;
  isEdit = false;
  tourId: number | null = null;
  difficulties = ['Easy', 'Moderate', 'Challenging'];
  imagePreview: string | null = null;
  selectedImageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private tourService: TourService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.tourForm = this.fb.group({
      title: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      duration: ['', [Validators.required, Validators.min(1)]],
      difficulty: ['Easy', Validators.required],
      dates: ['', Validators.required],
      highlights: [''],
      maxBookings: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.tourId = Number(id);
      const tour = this.tourService.getTour(this.tourId);
      if (tour) {
        this.tourForm.patchValue({
          title: tour.title,
          location: tour.location,
          description: tour.description,
          price: tour.price,
          duration: tour.duration,
          difficulty: tour.difficulty,
          dates: tour.dates.join(', '),
          highlights: tour.highlights.join(', '),
          maxBookings: tour.maxBookings
        });
        this.imagePreview = tour.images[0];
      }
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedImageFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedImageFile = null;
  }

  onSubmit(): void {
    if (this.tourForm.invalid) return;
    if (!this.imagePreview && !this.isEdit) {
      alert('Please upload a photo for the tour');
      return;
    }

    const user = this.authService.getCurrentUser();
    const formValue = this.tourForm.value;
    
    // Если нет загруженного фото, используем изображение по умолчанию
    let tourImage = this.imagePreview;
    if (!tourImage && this.isEdit) {
      const existingTour = this.tourService.getTour(this.tourId!);
      tourImage = existingTour?.images[0] || 'https://picsum.photos/id/104/800/500';
    } else if (!tourImage) {
      tourImage = 'https://picsum.photos/id/104/800/500';
    }
    
    const tourData = {
      title: formValue.title,
      location: formValue.location,
      description: formValue.description,
      price: formValue.price,
      duration: formValue.duration,
      difficulty: formValue.difficulty,
      dates: formValue.dates.split(',').map((d: string) => d.trim()),
      highlights: formValue.highlights ? formValue.highlights.split(',').map((h: string) => h.trim()) : [],
      images: [tourImage],
      organizerId: user?.id,
      organizerName: user?.name,
      rating: 0,
      reviews: 0,
      bookings: 0,
      maxBookings: formValue.maxBookings
    };

    if (this.isEdit && this.tourId) {
      this.tourService.updateTour(this.tourId, tourData);
    } else {
      this.tourService.createTour(tourData);
    }
    
    this.router.navigate(['/dashboard']);
  }
}
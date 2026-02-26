import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Review } from '../../../../interfaces/review.interface';
import { ReviewsService } from '../../../../services/reviews/reviews.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, Observable, of, tap } from 'rxjs';
import { ReviewFormComponent } from "../review-form/review-form.component";

@Component({
  selector: 'app-reviews-list',
  imports: [CommonModule, ReviewFormComponent],
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.scss'
})
export class ReviewsListComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Input() isUserReviews = false;
  reviews: Review[] = [];
  stars = [1, 2, 3, 4, 5];
  isLoading: boolean = false;
  totalReviews: number = 0;
  showEditForm: boolean = false;
  hideDelete: boolean = true;

  constructor (
    private route: ActivatedRoute,
    private reviewsService: ReviewsService
  ) {
    
  }

  ngOnInit () {
    this.isLoading = true;
    this.getReviews();
  }

  getReviews () {
    if (this.isUserReviews) {
      this.reviewsService.getUserReviews().subscribe({
        next: (data) => {
          this.reviews = data.reviews;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur détectée : ', err);
          this.isLoading = false;
        }
      });
    } else {
      const slug = this.route.snapshot.paramMap.get('name');

      if (slug) {
        const id = slug.split('-')[0];
        this.reviewsService.getItemReviews(+id).subscribe({
          next: (data) => {
            this.reviews = data.reviews;
            this.isLoading = false;
            this.totalReviews = data.reviews.length;
          },
          error: (err) => {
            console.error('Erreur détectée : ', err);
            this.isLoading = false;
          }
        })
      }
    }
  }

  closeReviewsModal() {
    this.close.emit();
  }

  openEditForm() {
    this.showEditForm = true;
  }

  closeEditForm() {
    this.showEditForm = false;
  }

  showDeletePopup() {
    this.hideDelete = false;
  }

  hideDeletePopup() {
    this.hideDelete = true;
  }
} 

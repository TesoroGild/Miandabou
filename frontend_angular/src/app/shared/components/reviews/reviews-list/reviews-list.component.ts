import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Review } from '../../../../interfaces/review.interface';
import { ReviewsService } from '../../../../services/reviews/reviews.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, Observable, of, tap } from 'rxjs';
import { ReviewFormComponent } from "../review-form/review-form.component";
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LangagesService } from '../../../../services/langages/langages.service';

@Component({
  selector: 'app-reviews-list',
  imports: [CommonModule, ReviewFormComponent, TranslatePipe],
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
  reviewToEdit!: Review;

  constructor (
    private translateService: TranslateService,
    private langService: LangagesService,
    private route: ActivatedRoute,
    private reviewsService: ReviewsService
  ) {
    this.translateService.use(this.langService.initLangage());
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

  openEditForm(review: Review) {
    this.showEditForm = true;
    this.reviewToEdit = review;
  }

  closeEditForm() {
    this.showEditForm = false;
  }

  reviewUpdated() {
    this.showEditForm = false;
    this.getReviews();
  }

  showDeletePopup() {
    this.hideDelete = false;
  }

  hideDeletePopup() {
    this.hideDelete = true;
  }
} 

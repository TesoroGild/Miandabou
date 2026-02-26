import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewsService } from '../../../../services/reviews/reviews.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { Review, ReviewCreated } from '../../../../interfaces/review.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-review-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss'
})
export class ReviewFormComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();
  @Input() forCreation = true;
  @Input() set reviewToEdit(val: any) {
    if (val) {
      this.reviewForm.patchValue(val);
      this.reviewFormBasedDatas = val;
      this.reviewId = val.id;
    }
  }
  reviewForm: FormGroup;
  reviewId: number = 0;
  reviewFormBasedDatas: any;

  constructor (
    private route: ActivatedRoute,
    private reviewsService: ReviewsService,
    private toastService: ToastService,
    private formBuilder: FormBuilder
  ) {
    this.reviewForm = this.formBuilder.group({
      rating: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(5)]),
      content: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() { 
    
  }

  stars = [1, 2, 3, 4, 5];

  setRating(value: number) {
    this.reviewForm.patchValue({ rating: value });
    this.reviewForm.get("content")?.markAsTouched();
  }

  get currentRating(): number {
    return this.reviewForm.get('rating')?.value || 0;
  }

  submit() {
    const slug = this.route.snapshot.paramMap.get('name');
    let id = "";

    if (this.forCreation)
      if (slug) id = slug.split('-')[0];
      else return;
    else id = this.reviewFormBasedDatas.itemId+"";
    
    if (this.reviewForm.valid) {
      let ratingValue = this.reviewForm.get("rating")!.value;
      let contentValue = this.reviewForm.get("content")!.value;

      if (ratingValue != null &&
          contentValue != null
      ) {
        const rv: ReviewCreated = {
          item_id: +id,
          rating: ratingValue,
          content: contentValue
        }
        
        if (this.forCreation) {
          this.reviewsService.createReview(rv).subscribe({
            next: (res: any) => {
              this.toastService.success(res.msg);
              this.reviewForm.reset();
              this.closeReviewFormModal();
            },
            error: (err: any) => {
              if (err.status >= 404 && err.status < 500) {
                this.toastService.error('Erreur : ' + err.error.msg);
              } else if (err.status >= 500 && err.status <= 511) {
                this.toastService.warning('Erreur : ' + err.error.msg);
              } else {
                this.toastService.warning('Erreur inconnue');
              }
            }
          });
        } else {
          this.reviewsService.updateReview(rv, this.reviewId).subscribe({
            next: (res: any) => {
              this.toastService.success(res.msg);
              this.reviewForm.reset();
              this.saved.emit();
              //this.closeReviewFormModal();
            },
            error: (err: any) => {
              if (err.status >= 404 && err.status < 500) {
                this.toastService.error('Erreur : ' + err.error.msg);
              } else if (err.status >= 500 && err.status <= 511) {
                this.toastService.warning('Erreur : ' + err.error.msg);
              } else {
                this.toastService.warning('Erreur inconnue');
              }
            }
          });
        }
      }
    }
  }

  closeReviewFormModal() {
    this.reviewForm.patchValue(this.reviewFormBasedDatas);
    this.close.emit();
  }
}

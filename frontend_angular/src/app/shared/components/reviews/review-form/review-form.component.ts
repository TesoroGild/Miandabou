import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  constructor (
    private route: ActivatedRoute,
    private reviewsService: ReviewsService,
    private toastService: ToastService,
    private router: Router,
  ) {
    
  }

  ngOnInit() { }

  reviewForm = new FormGroup({
    rating: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5)]),
    content: new FormControl('', Validators.required),
  });

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

    if (slug) {
      const id = slug.split('-')[0];

      if (this.reviewForm.valid) {
        let ratingValue = this.reviewForm.get("rating")!.value;
        let contentValue = this.reviewForm.get("content")!.value;

        if (ratingValue != null &&
            contentValue != null
        ) {
          const reviewToAdd: ReviewCreated = {
            item_id: +id,
            rating: ratingValue,
            content: contentValue
          }
          this.reviewsService.createReview(reviewToAdd).subscribe({
            next: (res: any) => {
              this.toastService.success(res.msg);
              this.reviewForm.reset();
              this.reviewsService.getItemReviews(+id);
              //const currentUrl = this.router.url;
              //remplacer true
              //if (currentUrl != "/cart") this.router.navigate(['']);
              this.closeReviewFormModal();
              //console.log(res)
            },
            error: (err: any) => {
              if (err.status >= 404 && err.status < 500) {
                this.toastService.error('Erreur : ' + err.msg);
              } else if (err.status >= 500 && err.status <= 511) {
                this.toastService.warning('Erreur : ' + err.msg);
                console.log(err.msg);
              } else {
                this.toastService.warning('Erreur inconnue');
              }
            }
              //est-ce que on doit actualiser la page en fond (item) et garder le modal ouvert?
                // const currentUrl = this.router.url;
                // //remplacer true
                // if (currentUrl != "/cart") this.router.navigate(['']);
                // else this.router.navigate(['/checkout'])
                // console.log("LOGIN: USER CONNECTED");
          });
        }
      }
    }
  }

  closeReviewFormModal() {
    this.close.emit();
  }
}

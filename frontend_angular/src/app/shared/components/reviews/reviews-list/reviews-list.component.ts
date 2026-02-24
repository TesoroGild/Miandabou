import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-reviews-list',
  imports: [],
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.scss'
})
export class ReviewsListComponent {
  @Input() itemToDelete: any;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  isUserReviews:boolean = false;

  closeReviewsModal() {
    this.close.emit();
  }
}

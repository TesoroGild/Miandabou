import { Component } from '@angular/core';
import { ReviewsListComponent } from '../../shared/components/reviews/reviews-list/reviews-list.component';

@Component({
  selector: 'app-reviews',
  imports: [ReviewsListComponent],
  templateUrl: './reviews.page.html',
  styleUrl: './reviews.page.scss'
})
export class ReviewsPage {

}

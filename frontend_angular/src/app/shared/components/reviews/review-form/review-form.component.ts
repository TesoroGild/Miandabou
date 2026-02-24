import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-review-form',
  imports: [],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.scss'
})
export class ReviewFormComponent {
  @Input() itemToDelete: any;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  createUpdate:boolean = true;

  closeReviewFormModal() {
    this.close.emit();
  }
}

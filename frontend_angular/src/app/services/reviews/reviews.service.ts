import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review, ReviewCreated } from '../../interfaces/review.interface';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}
  createReview(reviewToAdd: ReviewCreated) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.post<any>(
      `${environment.backendUrl}/api/reviews`,
      reviewToAdd,
      { headers }
    );
  }

  updateReview() {

  }

  deleteReview() {

  }

  getItemReviews(id: number) {
    return this.http.get<any>(`${environment.backendUrl}/api/reviews/${id}`);
  }

  getUserReviews() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.get<any>(
      `${environment.backendUrl}/api/reviews`,
      { headers }
    );
  }
}

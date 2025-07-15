import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<{ message: string; type: 'success' | 'error' | 'warning' }>();
  toast$ = this.toastSubject.asObservable();

  success(message: string) {
    this.toastSubject.next({ message, type: 'success' });
  }

  error(message: string) {
    this.toastSubject.next({ message, type: 'error' });
  }

  warning(message: string) {
    this.toastSubject.next({ message, type: 'warning' });
  }
}

import { Component, Input } from '@angular/core';
import { timer } from 'rxjs';

//Modules
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//Services
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  imports: [CommonModule, RouterModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  message: string = '';
  type: 'success' | 'error' | 'warning' | 'info' = 'success';
  isVisible: boolean = false;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toast$.subscribe(({message, type}) => {
      this.message = message;
      this.type = type;
      this.isVisible = true;
      timer(10000).subscribe(() => (this.isVisible = false));
    });
  }

  closeToast() {
    this.isVisible = false;
  }
}

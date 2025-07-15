import { Component, Input } from '@angular/core';

//Modules
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.css'
})
export class Toast {
  @Input() type: 'success' | 'danger' | 'warning' = 'success';
  @Input() message: string = '';
  isVisible: boolean = true;

  closeToast() {
    this.isVisible = false;
  }
}

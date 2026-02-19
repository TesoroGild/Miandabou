import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from '../../../../services/toast/toast.service';
import { Item } from '../../../../interfaces/item.interface';
import { environment } from '../../../../../environments/environment';
import { ItemService } from '../../../../services/item/item.service';

@Component({
  selector: 'app-delete-item',
  imports: [CommonModule],
  templateUrl: './delete-item.component.html',
  styleUrl: './delete-item.component.scss'
})
export class DeleteItemComponent {
  @Input() itemToDelete: any;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    //private router: Router,
    private toastService: ToastService,
    private itemService: ItemService,
  ) {

  }

  ngOnInit() {

  }

  closeDeleteModal() {
    this.close.emit();
  }

  async deleteItem() {
    this.itemService.deleteItem(this.itemToDelete.id).subscribe({
      next: (res: any) => {
        this.itemService.getItems();
        this.toastService.success(res.msg);
        this.closeDeleteModal();
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
    });
  }

  picture (contenthash: any) {
      return `${environment.backendUrl}/uploads/images/${contenthash}`
    }
}

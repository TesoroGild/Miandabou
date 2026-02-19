import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService } from '../../../../services/item/item.service';
import { ToastService } from '../../../../services/toast/toast.service';

@Component({
  selector: 'app-update-item',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-item.component.html',
  styleUrl: './update-item.component.scss'
})
export class UpdateItemComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  itemForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    //private router: Router,
    private toastService: ToastService
  ) {

  }

  ngOnInit() {

  }

  closeUpdateModal() {
    this.close.emit();
  }

  updateItem() {

  }
}

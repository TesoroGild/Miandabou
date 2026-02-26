import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemService } from '../../../../services/item/item.service';
import { ToastService } from '../../../../services/toast/toast.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-update-item',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-item.component.html',
  styleUrl: './update-item.component.scss'
})
export class UpdateItemComponent {
  @Input() set itmToUpdate(val: any) {
    if (val) {
      this.itemForm.patchValue(val);
      this.picBeforeUpdate = val.contenthash;
      this.itemId = val.id;
    }
  }
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  itemForm!: FormGroup;
  pictureTmp: FormControl= new FormControl('');
  hasImgExtension: boolean = true;
  picBeforeUpdate: any;
  itemId: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private toastService: ToastService
  ) {
    this.itemForm = this.formBuilder.group({
      name: [
        null, 
        [
          Validators.required,
          Validators.maxLength(250)
        ]
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(1000)
        ],
      ],
      category: [
        null, 
        [
          Validators.required
        ]
      ],
      price: [
        null, 
        [
          Validators.required,
          Validators.pattern(/^\d+(\.\d{1,2})?$/), // nombre avec max 2 décimales
          Validators.min(0.01)
        ]
      ],
      picture: [null],
      video: [null]
    });
  }

  ngOnInit() {

  }

  closeUpdateModal() {
    this.close.emit();
  }

  updateItem() {
    let nameValue = this.itemForm.get("name")!.value;
    let descriptionValue = this.itemForm.get("description")!.value;
    let categoryValue = this.itemForm.get("category")!.value;
    let priceValue = this.itemForm.get("price")!.value;


    if (nameValue != null &&
      descriptionValue != null &&
      categoryValue != null &&
      priceValue != null
    ) {
      const itemToUpdate = new FormData();

      for (let key in this.itemForm.controls) {//.value
        itemToUpdate.append(key, this.itemForm.value[key]);
      }
      
      if (this.pictureTmp.value) itemToUpdate.append("picture", this.pictureTmp.value);
      this.itemService.updateItem(this.itemId, itemToUpdate).subscribe({
        next: (res: any) => {
          this.itemService.getItems();
          this.toastService.success(res.msg);
          this.itemForm.reset();
          this.resetPicture();
          this.closeUpdateModal();
        },
        error: (err: any) => {
          if (err.status >= 404 && err.status < 500) {
            this.toastService.error('Erreur : ' + err.error.msg);
          } else if (err.status >= 500 && err.status <= 511) {
            this.toastService.warning('Erreur : ' + err.error.msg);
          } else {
            this.toastService.warning('Erreur inconnue');
          }
        }
      });
    }
  }

  nameEmpty(): boolean {
    return this.showError("name", "required");
  }

  descriptionEmpty(): boolean {
    return this.showError("description", "required");
  }

  priceEmpty(): boolean {
    return this.showError("price", "required");
  }

  priceFormat(): boolean {
    return this.itemForm.get('price')!.hasError('pattern') 
      && this.itemForm.get('price')!.touched;
  }

  private showError(
    field: "name" | "description" | "category" | "price",
    error: string): boolean {
    return (
      this.itemForm.controls[field].hasError(error) &&
      (this.itemForm.controls[field].dirty || this.itemForm.controls[field].touched)
    );
  }

  loadPicture(event: any): void {
    this.pictureTmp.setValue(event.target.files![0]);
    if (!this.pictureTmp) return;
    this.hasImgExtension = this.pictureExtension(this.pictureTmp.value.name);
    if (!this.hasImgExtension) return;
    const output = document.getElementById('preview_img') as HTMLImageElement;
    output.src = URL.createObjectURL(this.pictureTmp.value);
    output.onload = () => {
        URL.revokeObjectURL(output.src); // free memory
    };
  }

  pictureExtension (fileName: string): boolean {
    const type = fileName.split('.').pop() || '';
    if (type == 'png' || type == 'jpg' || type == 'jpeg' || type == 'gif' || type == 'bmp') return true;
    else return false;
  }

  resetPicture() {
    this.pictureTmp.setValue(null);
    this.pictureTmp.reset();
    const output = document.getElementById('preview_img') as HTMLImageElement;
    output.remove();
  }

  picture (contenthash: any) {
    return `${environment.backendUrl}/uploads/images/${contenthash}`
  }
}

import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

//Modules
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItemService } from '../../../services/item/item.service';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-manage-item',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-item.component.html',
  styleUrl: './manage-item.component.scss'
})
export class ManageItemComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  itemForm!: FormGroup;
  pictureTmp: FormControl= new FormControl('');
  hasImgExtension: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
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
      qte: [
        null, 
        [
          Validators.required,
          Validators.pattern(/^[1-9]\d*$/)
        ]
      ],
      picture: [null],
      video: [null]
    });
  }

  closeModal() {
    this.close.emit();
  }

  loadPicture(event: any): void {
    this.pictureTmp.setValue(event.target.files![0]);
    if (!this.pictureTmp) return;
    this.hasImgExtension = this.pictureExtension(this.pictureTmp.value.name);
    if (!this.hasImgExtension) return;
    console.log(this.pictureTmp.value);
    console.log(this.pictureTmp);

    const output = document.getElementById('preview_img') as HTMLImageElement;
    console.log(output);
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

  qteEmpty(): boolean {
    return this.showError("qte", "required");
  }

  qteFormat(): boolean {
    return this.itemForm.get('qte')!.hasError('pattern') 
      && this.itemForm.get('qte')!.touched;
  }

  private showError(
    field: "name" | "description" | "category" | "price" | "qte",
    error: string): boolean {
    return (
      this.itemForm.controls[field].hasError(error) &&
      (this.itemForm.controls[field].dirty || this.itemForm.controls[field].touched)
    );
  }

  addItem() {
    let nameValue = this.itemForm.get("name")!.value;
    let descriptionValue = this.itemForm.get("description")!.value;
    let categoryValue = this.itemForm.get("category")!.value;
    let priceValue = this.itemForm.get("price")!.value;
    let qteValue = this.itemForm.get("qte")!.value;

    if (nameValue != null &&
        descriptionValue != null &&
        categoryValue != null &&
        priceValue != null &&
        qteValue != null
    ) {
      const itemToAdd = new FormData();

      for (let key in this.itemForm.controls) {//.value
        itemToAdd.append(key, this.itemForm.value[key]);
      }
      
      if (this.pictureTmp.value) itemToAdd.append("picture", this.pictureTmp.value);
      
      this.itemService.addItem(itemToAdd).subscribe({
        next: (res: any) => {
          this.itemService.getItems();
          this.toastService.success(res.msg);
          this.itemForm.reset();
          this.resetPicture();
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
          //est-ce que on doit actualiser la page en fond (item) et garder le modal ouvert?
            // const currentUrl = this.router.url;
            // //remplacer true
            // if (currentUrl != "/cart") this.router.navigate(['']);
            // else this.router.navigate(['/checkout'])
            // console.log("LOGIN: USER CONNECTED");
      });
    }
  }

  /*TODO*/
  updateItem() {}

  deleteItem() {}
}

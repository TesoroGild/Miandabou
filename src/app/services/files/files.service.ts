import { Injectable } from '@angular/core';
import { environment } from '../../../environments/dev.environment';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  pictureTmp: FormControl= new FormControl('');
  hasUserExtension: boolean = true;
  hasImgExtension: boolean = true;
  
  userPicture(contenthash: string) {
  //   if (this.userToDisplay.contenthash) return `${environment.backendUrl}/uploads/images/${this.userToDisplay.contenthash}`
  //   else return "/assets/img/user_icon.png";
  }

  itemPicture() {

  }

  loadImgPicture(event: any): void {
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

  loadUserPicture(event: any): void {
    this.pictureTmp.setValue(event.target.files![0]);
    if (!this.pictureTmp) return;
    this.hasUserExtension = this.pictureExtension(this.pictureTmp.value.name);
    if (!this.hasUserExtension) return;
    console.log(this.pictureTmp.value);
    console.log(this.pictureTmp);

    const output = document.getElementById('preview_img') as HTMLImageElement;
    console.log(output);
    output.src = URL.createObjectURL(this.pictureTmp.value);
    output.onload = () => {
        URL.revokeObjectURL(output.src); // free memory
    };
  }

  resetPicture() {
    this.pictureTmp.setValue(null);
    this.pictureTmp.reset();
    const output = document.getElementById('preview_img') as HTMLImageElement;
    output.remove();
  }

  pictureExtension (fileName: string): boolean {
    const type = fileName.split('.').pop() || '';
    if (type == 'png' || type == 'jpg' || type == 'jpeg' || type == 'gif' || type == 'bmp') return true;
    else return false;
  }
}

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
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

  //PREVIOUSLY FILEREADER
  // async readFile(file: File): Promise<UserImageData> {
  //   const reader = new FileReader();
    
  //   const fileRead = new Promise<ArrayBuffer>((resolve, reject) => {
  //     reader.onload = (b) => resolve(reader.result as ArrayBuffer);
  //     reader.onerror = (e) => reject('could not read file');
  //   });
  //   reader.readAsArrayBuffer(file);
    
  //   const type = file.name.split('.').pop() || '';
  //   const b = await fileRead;
  //   return { data: this.arrayBufferToBase64(b), type: type };
  // }

  // private arrayBufferToBase64(buffer: ArrayBuffer): string {
  //   const bytes = new Uint8Array(buffer);
  //   let binary = '';

  //   for (var i = 0; i < bytes.byteLength; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return window.btoa(binary);
  // }
}

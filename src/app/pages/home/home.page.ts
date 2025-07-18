import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailService } from '../../services/email/email.service';

//Reusable components
import { ToastService } from '../../services/toast/toast.service';

//Modules
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  showToastError = false;
  showToastSuccess = false;
  showToastWarning = false;

  alertForm!: FormGroup;

  constructor(
    private emailService: EmailService,
    private toastService: ToastService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.alertForm = this.formBuilder.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
          Validators.maxLength(50),
        ],
      ]
    });
  }

  ngOnDestroy() {}

  subscribeNewsLetter () {
    console.log("ENABLE ALERTS");
    let emailValue = this.alertForm.get("email")?.value;
    const mailToAlert = new FormData();
    mailToAlert.append("email", this.alertForm.get("email")?.value);
      
    if (emailValue != null && emailValue != "") {
      this.emailService.addEmail(mailToAlert).subscribe((mailAdded: any) => {
        console.log(mailAdded.mail);
        if (mailAdded.mail != null && mailAdded.mail != undefined) {
          this.emailService.sendEmail(mailAdded.mail);
          this.toastService.success('Mail ajouté!');
          this.alertForm.reset();
        } else {
          this.toastService.error(mailAdded.msg);
        }
      });
    } else this.alertForm.markAllAsTouched();
  }

  //email
  emailEmpty(): boolean {
    return this.showError("email", "required");
  }

  emailFormat(): boolean {
    return this.alertForm.get('email')!.hasError('pattern') 
      && this.alertForm.get('email')!.touched;
  }

  emailLength(): boolean {
    return this.alertForm.get('email')!.hasError('maxlength') 
      && this.alertForm.get('email')!.touched;
  }

  private showError(field: "email", error: string): boolean {
    return (
      this.alertForm.controls[field].hasError(error) &&
      (this.alertForm.controls[field].dirty || this.alertForm.controls[field].touched)
    );
  }
}

import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailService } from '../../services/email/email.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';

//Reusable components
import { ToastService } from '../../services/toast/toast.service';

//Modules
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LangagesService } from '../../services/langages/langages.service';
import { OnSaleComponent } from "../../shared/components/on-sale/on-sale.component";

@Component({
  selector: 'app-home',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, TranslatePipe, RouterModule, OnSaleComponent],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  showToastError = false;
  showToastSuccess = false;
  showToastWarning = false;

  alertForm!: FormGroup;

  couponFound = {
    id: 1,
    rate : "20",
    value: "N/A",
    expiration_date: "2026-12-31",
    name: "THISISATEST"
  }

  testimonial = {
    rating: 4,
    text: `Flowbite is just awesome. It contains tons of predesigned components...`,
    author: "The Godfather"
  };

  feature = {
    title: "Une efficacité inégalée",
    description: "Avec Miandabou, consommez local. Satisfait ou remboursé sous 30 jours. Les meilleurs prix du marché."
  };

  currentIndex = 0;
  slides = ['carousel-item-1', 'carousel-item-2', 'carousel-item-3'];
  showItemsOnSaleComp: boolean = false;
  stars = [1, 2, 3, 4, 5];

  constructor(
    private emailService: EmailService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private langService: LangagesService
  ) {
    this.translateService.use(this.langService.initLangage());
  }

  ngOnInit() {
    this.alertForm = this.formBuilder.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
          Validators.maxLength(60),
        ],
      ]
    });
    this.showSlide(this.currentIndex);
  }

  ngOnDestroy() {}

  subscribeNewsLetter () {
    let emailValue = this.alertForm.get("email")?.value;
    const mailToAlert = new FormData();
    mailToAlert.append("email", this.alertForm.get("email")?.value);
      
    if (emailValue != null && emailValue != "") {
      this.emailService.addEmail(mailToAlert).subscribe((mailAdded: any) => {
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

  //Carousel
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.showSlide(this.currentIndex);
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.showSlide(this.currentIndex);
  }

  goTo(index: number) {
    this.currentIndex = index;
    this.showSlide(this.currentIndex);
  }

  private showSlide(index: number) {
    // cache tous les slides
    this.slides.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.toggle('hidden', i !== index);
      }
    });
  }

  displayDiscount () {
    if (this.couponFound.rate != undefined && this.couponFound.rate != "N/A" && this.couponFound.rate != "")
      return this.couponFound.rate + "%";
    else if (this.couponFound.value != undefined && this.couponFound.value != "N/A" && this.couponFound.value != "")
      return this.couponFound.value + "$";
    else return "0$";
  }

  openItemsOnSale() {
    this.showItemsOnSaleComp = true;
  }

  closeItemsOnSale() {
    this.showItemsOnSaleComp = false;
  }
}

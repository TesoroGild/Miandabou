import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { UserToDisplay } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth/auth.service';
import { CartService } from '../../services/cart/cart.service';
import { CheckoutService } from '../../services/checkout/checkout.service';
import { ToastService } from '../../services/toast/toast.service';
import { CommonModule } from '@angular/common';
import { Item, ItemCart, ItemToOrder } from '../../interfaces/item.interface';
import { Order, OrderToCreate } from '../../interfaces/order.interface';
import { CheckoutData } from '../../interfaces/checkout.interface';

declare const google: any;

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.page.html',
  styleUrl: './checkout.page.scss'
})
export class CheckoutPage {
  //TEST ZONE
  //autocomplete.addListener('place_changed', fillInAddress);
  //###################################

  checkoutForm!: FormGroup;
  policyModal: boolean = false;
  selectedValue: string = 'emailcommunication';
  isChecked: boolean = false;
  total: number = 0;
  subTotal: number = 0;
  delivery: number = 0;
  userIsLoggedIn: boolean = false;
  userToDisplay$: Observable<UserToDisplay>;
  userToDisplay: UserToDisplay = {} as UserToDisplay;
  userSubscription!: Subscription;
  itemsCart: ItemCart[] = [];
  itemsToOrder: ItemToOrder[] = [];


  constructor (
    private router: Router,
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private checkoutService: CheckoutService,
    private toastService: ToastService
  ) {
    this.userToDisplay$ = this.authService.getUserToDisplay();
  }

  ngOnInit () {
    this.checkoutForm = this.formBuilder.group({
      address: [
        null,
        [
          Validators.required
        ]
      ],
      suite: [null],
      city: [
        null,
        [
          Validators.required
        ]
      ],
      province: [
        null,
        [
          Validators.required
        ]
      ],
      zipcode: [
        null,
        [
          Validators.required
        ]
      ],
      country: [
        null,
        [
          Validators.required
        ]
      ],
      phonenumber: [
        null,
        [
          Validators.pattern(/^(\(\d{3}\) \d{3}-\d{4})$/)
        ]
      ],
      meansofcommunication: [
        '',
        [
          Validators.required
        ]
      ],
      istermaccepted: [
        false,
        [
          Validators.requiredTrue
        ]
      ],
      cardowner: [
        null,
        [
          Validators.required,
          Validators.maxLength(255)
        ]
      ],
      cardnumber: [
        null,
        [
          Validators.required,
          Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)
        ]
      ],
      cardexpirationdate: [
        null,
        [
          Validators.required,
          Validators.minLength(5)
        ]
      ],
      cvv: [
        null,
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ]
    });
    this.checkoutForm.get('meansofcommunication')?.valueChanges.subscribe((value) => {
      if (value === 'phonecommunication' 
        && (this.checkoutForm.get('phonenumber')?.value === "" 
        || this.checkoutForm.get('phonenumber')?.value === null
        || this.checkoutForm.get('phonenumber')?.value === undefined)) {
        this.phoneNumberEmpty();
      }
    });
    this.userSubscription = this.userToDisplay$.subscribe((u) => {
      this.userToDisplay = u;
      this.checkoutForm.get("userEmail")?.setValue(this.userToDisplay.email);
      this.checkoutForm.get("phonenumber")?.setValue(this.userToDisplay.tel);
    })
    this.cartService.getItemsCartToDisplay().subscribe(items => {
      this.itemsCart = items;
      this.mapItemsToOrder(this.itemsCart);
    });
    this.cartService.getCartTotal().subscribe(subTotal => {
      this.subTotal = subTotal;
    });
    this.cartService.getCheckoutTotal().subscribe(total => {
      this.total = total;
    });
    this.cartService.getDelivery().subscribe(delivery => {
      this.delivery = delivery;
    });
  }

  mapItemsToOrder(items: ItemCart[]) {
    items.forEach(item => {
      let ito = {
        itemId: item.item.id,
        itemName: item.item.name,
        itemPicture: item.item.picture,
        itemContenthash: item.item.contenthash,
        quantityBuy: item.quantityBuy,
        itemPrice: this.cartService.itemTotal(item.item.id)
      }
      this.itemsToOrder.push(ito);
    });
  }

  ngAfterViewInit () { }

  isUserLoggedIn() {
    this.authService.userIsLoggedIn.subscribe({
      next: (result)=> {
        this.userIsLoggedIn = result;
      }
    })
    return this.userIsLoggedIn; 
  }

  openPolicyModal() {
    this.policyModal = true;
  }

  closePolicyModal () {
    this.policyModal = false;
  }

  pay () {
    if (this.isUserLoggedIn()) {
      console.log("CHECKOUT: USER IS LOGGED IN");
      let addressValue = this.checkoutForm.get("address")?.value;
      let cityValue = this.checkoutForm.get("city")?.value;
      let provinceValue = this.checkoutForm.get("province")?.value;
      let zipcodeValue = this.checkoutForm.get("zipcode")?.value;
      let countryValue = this.checkoutForm.get("country")?.value;
      let suiteValue:string = this.checkoutForm.get("suite")?.value;
      if (suiteValue == null || suiteValue == undefined 
        || suiteValue.trim().length == 0) suiteValue = "N/A";
      let meansofcommunicationValue = this.checkoutForm.get("meansofcommunication")?.value;
      let istermacceptedValue = this.checkoutForm.get("istermaccepted")?.value;
      let cardExpirationDateValue = this.checkoutForm.get("cardexpirationdate")?.value;
      let cvvValue = this.checkoutForm.get("cvv")?.value;
      let cardownerValue = this.checkoutForm.get("cardowner")?.value;
      let cardnumberValue = this.checkoutForm.get("cardnumber")?.value;
//this.userToDisplay.email != undefined && this.userToDisplay.email != null
      if (addressValue != null
        && cardnumberValue != null && cityValue != null
        && provinceValue != null && zipcodeValue != null
        && countryValue != null && meansofcommunicationValue != null
        && istermacceptedValue != null && cardExpirationDateValue != null
        && cvvValue != null && cardownerValue != null
        && suiteValue != null
      ) {
        const checkoutDatas: CheckoutData = {
          order: {
            //userEmail: this.userToDisplay.email!,
            userEmail: "admin@admin.ca",
            total: this.total
          },
          address: {
            fulladdress: this.checkoutForm.get("address")?.value,
            city: this.checkoutForm.get("city")?.value,
            province: this.checkoutForm.get("province")?.value,
            zipcode: this.checkoutForm.get("zipcode")?.value,
            country: this.checkoutForm.get("country")?.value,
            appnumber: suiteValue
          },
          items: this.itemsToOrder,
          cardInfos: {
            cardexpirationdate: this.checkoutForm.get("cardexpirationdate")?.value,
            cvv: this.checkoutForm.get("cvv")?.value,
            cardowner: this.checkoutForm.get("cardowner")?.value,
            cardnumber: this.checkoutForm.get("cardnumber")?.value
          },
          additionalInfos: {
            meansofcommunication: this.checkoutForm.get("meansofcommunication")?.value,
            phonenumber: this.checkoutForm.get("phonenumber")?.value
          }
        }

        this.checkoutService.checkout(checkoutDatas).subscribe({
          next: (res: any) => {
            this.checkoutForm.reset();
            this.toastService.success(res.msg);
            this.router.navigate(['/bills']);
          },
          error: (err: any) => {
            this.toastService.error(err.error.msg);
            console.log(err.error.msg);
            console.log(err.msg);
          }
      });
      } else this.checkoutForm.markAllAsTouched();
    } //**else this.router.navigate(['/login']);
  }

  //phonenumber
  phoneNumberEmpty(): boolean {
    const meansofcommunication = this.checkoutForm.get("meansofcommunication")?.value;
    if (meansofcommunication == "phonecommunication")
      return this.showPhoneError("phonenumber", "required")
      || this.showError("phonenumber", "required");
    else return false;
  }

  formatPhoneNumberInput(inputElement: HTMLInputElement) {
    let rawValue = inputElement.value.replace(/\D/g, '');

    let formattedNumber = '';
    if (rawValue.length > 0) {
      formattedNumber = '(' + rawValue.substring(0, 3) + ') ' + rawValue.substring(3, 6) + '-' + rawValue.substring(6, 10);
    }
    
    inputElement.value = formattedNumber;
  }

  phoneNumberFormat() {
    return this.checkoutForm.get('phonenumber')!.hasError('pattern') 
      && this.checkoutForm.get('phonenumber')!.touched;
  }

  private showError(
    field: "address" | "city" | "province" | "zip" | "country" | "phonenumber", 
    error: string): boolean {
    return (
      this.checkoutForm.controls[field].hasError(error) &&
      (this.checkoutForm.controls[field].dirty || this.checkoutForm.controls[field].touched)
    );
  }

  private showPhoneError(
    field: "phonenumber", 
    error: string): boolean {
    return (
      this.checkoutForm.controls[field].hasError(error)
    );
  }

  todoVisa() {
    console.log("todoVisa");
  }
  todoPaypal() {
    console.log("todoPaypal");
  }
  todoMastercard() {
    console.log("todoMastercard");
  }

  isFormValid() {
    return !(this.checkoutForm.get("address")?.value != null
      && this.checkoutForm.get("city")?.value != null
      && this.checkoutForm.get("province")?.value != null
      && this.checkoutForm.get("zipcode")?.value != null
      && this.checkoutForm.get("country")?.value != null
      && this.checkoutForm.get("meansofcommunication")?.value != null
      && this.checkoutForm.get("istermaccepted")?.value != false
      && this.checkoutForm.get("cardexpirationdate")?.value != null
      && this.checkoutForm.get("cvv")?.value != null
      && this.checkoutForm.get("cardowner")?.value != null
      && this.checkoutForm.get("cardnumber")?.value != null
    );
  }
}

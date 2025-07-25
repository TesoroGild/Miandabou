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

@Component({
  selector: 'app-checkout',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.page.html',
  styleUrl: './checkout.page.scss'
})
export class CheckoutPage {
  //TEST ZONE
  autocomplete.addListener('place_changed', fillInAddress);
  //###################################

  checkoutForm!: FormGroup;

  policyModal: boolean = false;
  methodModal: string = "";
  private apiUrl = 'https://restcountries.com/v3.1/all';
  countries: any[] = [];
  selectedValue: string = 'emailcommuication';
  isChecked: boolean = false;

  total: number = 0;
  subTotal: number = 0;
  delivery: number = 0;
  userIsLoggedIn: boolean = false;
  userToDisplay$: Observable<UserToDisplay>;
  userToDisplay: UserToDisplay = {} as UserToDisplay;
  userSubscription!: Subscription;
  //coutriesDropdownOpen = false;
  //selectedCountry: any;

  constructor (
    //private http: HttpClient,
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
      firstname: [
        null, 
        [
          Validators.required,
          Validators.maxLength(35)
        ]
      ],
      lastname: [
        null, 
        [
          Validators.required,
          Validators.maxLength(35)
        ]
      ],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
          Validators.maxLength(35),
        ]
      ],
      address: [
        null,
        [
          Validators.required
        ]
      ],
      suite: [
        null,
        [
          Validators.required
        ]
      ],
      city: [
        null,
        [
          Validators.required
        ]
      ],
      state: [
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
          Validators.required
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
          Validators.required
        ]
      ]
    });
    this.userSubscription = this.userToDisplay$.subscribe((u) => {
      this.userToDisplay = u;
      this.checkoutForm.get("firstname")?.setValue(this.userToDisplay.firstname);
      this.checkoutForm.get("lastname")?.setValue(this.userToDisplay.lastname);
      this.checkoutForm.get("email")?.setValue(this.userToDisplay.email);
      this.checkoutForm.get("phonenumber")?.setValue(this.userToDisplay.tel);
    })
    this.cartService.getCartTotal().subscribe(subTotal => {
      this.subTotal = subTotal;
    });
    this.cartService.getCheckoutTotal().subscribe(total => {
      this.total = total;
    });
    this.cartService.getDelivery().subscribe(delivery => {
      this.delivery = delivery;
    });
    // this.checkoutForm.get('istermaccepted')?.valueChanges.subscribe(termvalue => {
    //   console.log('Checkbox is checked:', termvalue);
    // });
    // this.checkoutForm.get('meansofcommunication')?.valueChanges.subscribe(commuicationvalue => {
    //   console.log('Selected option:', commuicationvalue);
    // });
    //COUNTRIES WITH FLAGS API
    //this.getCountries().subscribe(data => {
    //  this.filterCountries(data);
    //});
  }

  ngAfterViewInit () {
    // const input = document.getElementById('location-input') as HTMLInputElement;
    // const autocomplete = new google.maps.places.Autocomplete(input, {
    //   fields: ['address_components', 'geometry', 'name'],
    //   types: ['address'],
    //   componentRestrictions: { country: 'ca' }
    // });
    // autocomplete.addListener('place_changed', () => {
    //   const place = autocomplete.getPlace();
    //   if (!place.geometry) {
    //     window.alert(`No details available for input: '${place.name}'`);
    //     return;
    //   }
    //   this.fillInAddress(place);
    // });
  }

  //COUNTRIES WITH FLAGS AND DROPDOWN
  // getCountries(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl);
  // }
  
  // filterCountries (data: any) {
  //   let countriesSorted = [];
  //   countriesSorted = data.sort(
  //     (a:any, b:any) => a.name.official.localeCompare(b.name.official)
  //   );
  //   this.countries = countriesSorted;
  // }

  
  // toggleCoutriesDropdown(): void {
  //   this.coutriesDropdownOpen = !this.coutriesDropdownOpen;
  // }

  // selectCountry(country: any): void {
  //   this.selectedCountry = country;
  //   this.coutriesDropdownOpen = false;
  // }

  isUserLoggedIn() {
    this.authService.userIsLoggedIn.subscribe({
      next: (result)=> {
        this.userIsLoggedIn = result;
      }
    })
    return this.userIsLoggedIn; 
  }

  paymentPage () {
    this.router.navigate(['/payment']);
  }

  openPolicyModal() {
    this.policyModal = true;
  }

  closePolicyModal () {
    this.policyModal = false;
  }

  methodInfosToDisplay (method: string) {
    this.methodModal = method;
  }

  validForm () {
    if (this.isUserLoggedIn()) {
      console.log("CHECKOUT: USER IS LOGGED IN");
    } else {
      console.log("CHECKOUT: USER IS NOT LOGGED IN");
      let firstNameValue = this.checkoutForm.get("firstName")?.value;
      let lastNameValue = this.checkoutForm.get("lastName")?.value;
      let emailValue = this.checkoutForm.get("email")?.value;
      let addressValue = this.checkoutForm.get("address")?.value;
      let suiteValue = this.checkoutForm.get("suite")?.value;
      let cityValue = this.checkoutForm.get("city")?.value;
      let stateValue = this.checkoutForm.get("state")?.value;
      let zipcodeValue = this.checkoutForm.get("zipcode")?.value;
      let countryValue = this.checkoutForm.get("country")?.value;
      let meansofcommunicationValue = this.checkoutForm.get("meansofcommunication")?.value;
      let istermacceptedValue = this.checkoutForm.get("istermaccepted")?.value;
        
      const orderToCreate = new FormData();
      orderToCreate.append("firstName", this.checkoutForm.get("firstName")?.value);
      orderToCreate.append("lastName", this.checkoutForm.get("lastName")?.value);
      orderToCreate.append("email", this.checkoutForm.get("email")?.value);
      orderToCreate.append("address", this.checkoutForm.get("address")?.value);
      orderToCreate.append("suite", this.checkoutForm.get("suite")?.value);
      orderToCreate.append("city", this.checkoutForm.get("city")?.value);
      orderToCreate.append("state", this.checkoutForm.get("state")?.value);
      orderToCreate.append("zipcode", this.checkoutForm.get("zipcode")?.value);
      orderToCreate.append("country", this.checkoutForm.get("country")?.value);
      orderToCreate.append("meansofcommunication", this.checkoutForm.get("meansofcommunication")?.value);
      orderToCreate.append("istermaccepted", this.checkoutForm.get("istermaccepted")?.value);
      
      if (emailValue != null && firstNameValue != null
        && lastNameValue != null
      ) {
        this.checkoutService.order(orderToCreate).subscribe((orderCreated: any) => {
          console.log(orderCreated);
          if (orderCreated.oder != null && orderCreated.oder != undefined) {
            this.toastService.success(orderCreated.msg);
            this.checkoutForm.reset();
            this.router.navigate(['']);
          } else {
            this.toastService.error(orderCreated.msg);
            //this.checkoutForm.reset();
          }
        });
      } else this.checkoutForm.markAllAsTouched();
    }
  }

  fillInAddress() {
    const place = this.autocomplete.getPlace();
    for (const component of place.address_components) {
      const componentType = component.types[0];

      switch (componentType) {
        case "locality":
          document.querySelector("#locality")!.value = component.long_name;
          break;
      }
    }
  }

  // fillInAddress(place: google.maps.places.PlaceResult) {
  //   const addressComponents: { [key: string]: string } = {};
  //   for (const component of place.address_components || []) {
  //     const addressType = component.types[0];
  //     addressComponents[addressType] = component.long_name;
  //   }

  //   // Fill in address form fields
  //   (document.getElementById('location-input') as HTMLInputElement).value =
  //     `${addressComponents['street_number'] || ''} ${addressComponents['route'] || ''}`.trim();
  //   (document.getElementById('locality-input') as HTMLInputElement).value = addressComponents['locality'] || '';
  //   (document.getElementById('administrative_area_level_1-input') as HTMLInputElement).value =
  //     addressComponents['administrative_area_level_1'] || '';
  //   (document.getElementById('postal_code-input') as HTMLInputElement).value = addressComponents['postal_code'] || '';
  //   (document.getElementById('country-input') as HTMLInputElement).value = addressComponents['country'] || '';
  // }

  //firstname
  firstnameEmpty(): boolean {
    return this.showError("firstname", "required");
  }

  firstnameLength(): boolean {
    return this.checkoutForm.get('firstname')!.hasError('maxlength') 
      && this.checkoutForm.get('firstname')!.touched;
  }

  //lastname
  lastnameEmpty(): boolean {
    return this.showError("lastname", "required");
  }

  lastnameLength(): boolean {
    return this.checkoutForm.get('lastname')!.hasError('maxlength') 
      && this.checkoutForm.get('lastname')!.touched;
  }

  //email
  emailEmpty(): boolean {
    return this.showError("email", "required");
  }

  emailFormat(): boolean {
    return this.checkoutForm.get('email')!.hasError('pattern') 
      && this.checkoutForm.get('email')!.touched;
  }

  emailLength(): boolean {
    return this.checkoutForm.get('email')!.hasError('maxlength') 
      && this.checkoutForm.get('email')!.touched;
  }

  //phonenumber
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
    field: "email" | "firstname" | "lastname" | "address" | "city" | "state" | "zip" | "country" | "phonenumber", 
    error: string): boolean {
    return (
      this.checkoutForm.controls[field].hasError(error) &&
      (this.checkoutForm.controls[field].dirty || this.checkoutForm.controls[field].touched)
    );
  }
}

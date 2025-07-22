import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { ToastService } from '../../services/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss'
})
export class RegisterPage {
  phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/;
  registerForm!: FormGroup;

  userIsLoggedIn: boolean = false;
  userPicture: File | null = null;
  pictureTmp: FormControl= new FormControl('');
  phone: string = '';
  hasUserExtension: boolean = true;
  cpassword: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
          Validators.maxLength(35)
        ],
      ],
      password: [
        null, 
        [
          Validators.required
        ]
      ],
      username: [
        null, 
        [
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
      role: [
        null, 
        [
          Validators.required,
          Validators.maxLength(35)
        ]
      ],
      firstname: [
        null, 
        [
          Validators.required,
          Validators.maxLength(35)
        ]
      ],
      dateOfBirth: [null],
      picture: [null],
      tel: [
        null,
        [
          Validators.pattern(this.phonePattern)
        ]
      ],
      status: [
        false, 
        [
          Validators.required
        ]
      ],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  async register() {
    if(this.isUserLoggedIn()) {
      console.log("REGISTER: USER CONNECTED");
      this.toastService.warning("Vous devez d'abord vous déconnecter!");
    } else {
      console.log("REGISTER: USER NONCONNECTED");
      let emailValue = this.registerForm.get("email")!.value;
      let passwordValue = this.registerForm.get("password")!.value;
      let lastnameValue =  this.registerForm.get("lastname")!.value;
      let firstnameValue =  this.registerForm.get("firstname")!.value;
      let statusValue =  this.registerForm.get("status")!.value;
      let roleValue: string[] =  this.registerForm.get("role")!.value;
      let acceptTermsValue = this.registerForm.get("acceptTerms")!.value;
      let dateOfBirthValue = this.registerForm.get("dateOfBirth")!.value;

      if (
        emailValue != null &&
        passwordValue != null &&
        lastnameValue  != null &&
        firstnameValue != null &&
        statusValue != null &&
        roleValue[0] != "false" &&
        dateOfBirthValue != null &&
        acceptTermsValue != false
      ) {
        const userToCreate = new FormData();
        for (let elmKey in this.registerForm.controls) {
          let elmValue = this.registerForm.value[elmKey];
          userToCreate.append(elmKey, elmValue);
        }

        userToCreate.delete('acceptTerms');

        if (this.pictureTmp.value)
          userToCreate.append('picture', this.pictureTmp.value);

        //logique token
        //let token: string = "";
        //token = this.authService.getToken() as string;
        this.userService.createUser(userToCreate).subscribe((userCreated: any) => {
          if (userCreated.user!= null && userCreated.user != undefined) {
            //CAS ou c'est le user qui fait le register
            //CAS ou c'est l'admin qui fait le register
            this.authService.setUserToDisplay(userCreated.user);
            this.toastService.success("Connexion reussie!");
            this.registerForm.reset();
            this.resetPicture();
            //if (userCreated.role == "employee") this.router.navigate(['/employeehome']);
            //else if (userCreated.role == "admin") this.router.navigate(['/adminhome']);
            //else console.log("TU T'ES PLANTE")
            this.router.navigate(['/home']);
            console.log("REGISTER: USER CREATE");
          } else {
            this.toastService.error(userCreated.msg);
          }
        });
      } else this.registerForm.markAllAsTouched();
    }
  }

  resetPicture() {
    this.pictureTmp.setValue(null);
    this.pictureTmp.reset();
    const output = document.getElementById('preview_img') as HTMLImageElement;
    output.remove();
  }

  isUserLoggedIn() {
    this.authService.userIsLoggedIn.subscribe({
      next: (result)=> {
        this.userIsLoggedIn = result;
      }
    })
    return this.userIsLoggedIn; 
  }

  //firstname
  firstnameEmpty(): boolean {
    return this.showError("firstname", "required");
  }

  firstnameLength(): boolean {
    return this.registerForm.get('firstname')!.hasError('maxlength') 
      && this.registerForm.get('firstname')!.touched;
  }

  //lastname
  lastnameEmpty(): boolean {
    return this.showError("lastname", "required");
  }

  lastnameLength(): boolean {
    return this.registerForm.get('lastname')!.hasError('maxlength') 
      && this.registerForm.get('lastname')!.touched;
  }

  //date of birth

  //username
  unameEmpty(): boolean {
    return this.showError("username", "required");
  }

  unameLength(): boolean {
    return this.registerForm.get('username')!.hasError('maxlength') 
      && this.registerForm.get('username')!.touched;
  }

  //email
  emailEmpty(): boolean {
    return this.showError("email", "required");
  }

  emailFormat(): boolean {
    return this.registerForm.get('email')!.hasError('pattern') 
      && this.registerForm.get('email')!.touched;
  }

  emailLength(): boolean {
    return this.registerForm.get('email')!.hasError('maxlength') 
      && this.registerForm.get('email')!.touched;
  }

  //tel
  formatInput(inputElement: HTMLInputElement) {
    // Get the raw input value
    let rawValue = inputElement.value.replace(/\D/g, '');

    // Apply phone number format (xxx) xxx-xxxx
    let formattedNumber = '';
    if (rawValue.length > 0) {
      formattedNumber = '(' + rawValue.substring(0, 3) + ') ' + rawValue.substring(3, 6) + '-' + rawValue.substring(6, 10);
    }
    
    // Update the input value with the formatted number
    inputElement.value = formattedNumber;
  }

  phoneFormat() {
    return this.registerForm.get('tel')!.hasError('pattern') 
      && this.registerForm.get('tel')!.touched;
  }

  //picture
  loadPicture(event: any): void {
    this.pictureTmp.setValue(event.target.files![0]);
    if (!this.pictureTmp) return;
    this.hasUserExtension = this.pictureExtension(this.pictureTmp.value.name);
    if (!this.hasUserExtension) return;

    const output = document.getElementById('preview_user_img') as HTMLImageElement;

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

  //password
  passwordEmpty(): boolean {
    return this.showError("password", "required");
  }

  //cpassword
  cpasswordMatch(): boolean {
    if (this.registerForm.get('password')!.value != this.cpassword)
      return false;
    else return true;
  }

  private showError(
    field: "email" | "password" | "firstname" | "lastname" | "role" | "dateOfBirth" | "picture" | "tel" | "username", 
    error: string): boolean {
    return (
      this.registerForm.controls[field].hasError(error) &&
      (this.registerForm.controls[field].dirty || this.registerForm.controls[field].touched)
    );
  }
}

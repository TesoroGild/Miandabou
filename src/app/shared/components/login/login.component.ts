import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast/toast.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-comp',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  userIsLoggedIn: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
    email: [
      null,
      [
        Validators.required,
        Validators.pattern('^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
        Validators.maxLength(35),
      ],
    ],
    password: [null, [Validators.required]],
  });
  }

  async login() {
    if(this.isUserLoggedIn()) {
      console.log("LOGIN: USER CONNECTED");
      this.toastService.warning('Un utilisateur est déjà connecté!');
    } else {
      console.log("LOGIN: USER NONCONNECTED");
      let emailValue = this.loginForm.get("email")?.value;
      let passwordValue = this.loginForm.get("password")?.value;
      const userToConnect = new FormData();
      userToConnect.append("email", this.loginForm.get("email")?.value);
      userToConnect.append("password", this.loginForm.get("password")?.value);

      if (emailValue != null && passwordValue != null) {
        this.authService.logIn(userToConnect).subscribe((userConnected: any) => {
          console.log(userConnected.user);
          if (userConnected.user != null && userConnected.user != undefined) {
            this.authService.setUserToDisplay(userConnected.user, userConnected.token);
            this.toastService.success(userConnected.msg);
            this.loginForm.reset();
            const currentUrl = this.router.url;
            //remplacer true
            if (currentUrl != "/cart") this.router.navigate(['']);
            else this.router.navigate(['/checkout'])
            console.log("LOGIN: USER CONNECTED");
          } else {
            this.toastService.error(userConnected.msg);
            this.loginForm.reset();
          }
        });
      } else this.loginForm.markAllAsTouched();
    }
  }

  isUserLoggedIn() {
    this.authService.userIsLoggedIn.subscribe({
      next: (result)=> {
        this.userIsLoggedIn = result;
      }
    })
    return this.userIsLoggedIn; 
  }

  emailEmpty(): boolean {
    return this.showError("email", "required");
  }

  emailFormat(): boolean {
    return this.loginForm.get('email')!.hasError('pattern') 
      && this.loginForm.get('email')!.touched;
  }

  emailLength(): boolean {
    return this.loginForm.get('email')!.hasError('maxlength') 
      && this.loginForm.get('email')!.touched;
  }

  passwordEmpty(): boolean {
    return this.showError("password", "required");
  }

  private showError(field: "email" | "password", error: string): boolean {
    return (
      this.loginForm.controls[field].hasError(error) &&
      (this.loginForm.controls[field].dirty || this.loginForm.controls[field].touched)
    );
  }
}

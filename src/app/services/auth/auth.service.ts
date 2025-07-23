import { Injectable } from '@angular/core';
import { UserToDisplay } from '../../interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/dev.environment';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../toast/toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  keyRole: string = 'role';
  keyToken: string = 'token';

  //userToDisplay: UserToDisplay = { } as UserToDisplay;

  userIsLoggedIn = new BehaviorSubject<boolean>(false);
  userIsAdmin = new BehaviorSubject<boolean>(false);
  userToDisplay = new BehaviorSubject<UserToDisplay>({} as UserToDisplay);

  userConnected: UserToDisplay = { } as UserToDisplay;

  constructor(
    private http : HttpClient,
    private toastService: ToastService,
    private router: Router
  ) { 
    const token = localStorage.getItem('token');
    const admin = localStorage.getItem('role');
    this.userIsLoggedIn.next(!!token);
    this.userIsAdmin.next(!!admin);
  }

  isLoggedIn() {
    return localStorage.getItem('token') != null;
  }

  logIn(userToConnect: FormData) {
    //<LoginResponse>
    return this.http.post<any>(
      `${environment.backendUrl}/api/login`, 
      userToConnect
    );
  }

  // logOut() {
  //   const qparams = { 'id': 0 };
  //   return this.http.post<any>(
  //     `${environment.backendUrl}/php/users/userLogout.php`, 
  //     { /*params: qparams*/ }
  //   );
  // }

  logOut() {
    if (this.isLoggedIn()) {
      this.unsetUserToDisplay();
      this.router.navigate(['/home']);
      console.log("LOGOUT: USER DISCONNECTED");
      


    //if (this.isUserLoggedIn()) {
      // this.authService.logOut().subscribe((userLogout: any) => {
      //   if (userLogout.msg.trim() != "") {
      //     this.authService.unsetUserToDisplay();
      //     this.toastService.success(userLogout.msg);
      //     this.router.navigate(['/home']);
      //     console.log("LOGOUT: USER DISCONNECTED");
      //   } else {
      //     this.toastService.warning("Erreur lors de la déconnection!");
      //   }
      // });
      //}
    } else {
      this.toastService.warning("Aucun utilisateur connecté!");
    }
  }

  // isUserLoggedIn() {
  //   this.authService.userIsLoggedIn.subscribe({
  //     next: (result)=> {
  //       this.userIsLoggedIn = result;
  //     }
  //   })
  //   return this.userIsLoggedIn; 
  // }

  isAdmin() {
    return localStorage.getItem(this.keyRole)?.search("ROLE_ADMIN") != -1;
  }

  setSession(token: string, roles: string[]) {
    console.log(roles);
    console.log(token);
    localStorage.setItem(this.keyToken, token);
    localStorage.setItem(this.keyRole, JSON.stringify(roles));
    this.userIsLoggedIn.next(true);

    // envoyer le token JWT dans l'en-tête d'autorisation des requêtes HTTP
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem(this.keyToken)
      })
    };
  }

  unsetSession() {
    localStorage.removeItem(this.keyToken);
    localStorage.removeItem(this.keyRole);
    localStorage.clear();
    this.userIsLoggedIn.next(false);
    this.userIsAdmin.next(false);
    if (this.isLoggedIn()) this.toastService.success("Déconnexion réussie!");
    else this.toastService.warning("Erreur lors de la déconnection!");
  }

  getToken(): string | null {
    return localStorage.getItem(this.keyToken);
  }

  setUserToDisplay(user: UserToDisplay, token: string) {
    //this.userToDisplay = user;
    this.userToDisplay.next(user);
    this.setSession(token, user.roles);
    return this.userToDisplay.asObservable();
    //console.log(this.userToDisplay);
  }

  unsetUserToDisplay() {
    //this.userToDisplay = user;
    this.userToDisplay.next({} as UserToDisplay);
    this.unsetSession();
    return this.userToDisplay.asObservable();
    //console.log(this.userToDisplay);
  }

  getUserToDisplay() {
    return this.userToDisplay.asObservable();
  }
}

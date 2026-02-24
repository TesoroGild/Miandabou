import { Injectable } from '@angular/core';
import { UserToDisplay } from '../../interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../toast/toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  keyRole: string = 'role';
  keyToken: string = 'token';
  keyUser: string = 'user';
  userIsLoggedIn = new BehaviorSubject<boolean>(false);
  userIsAdmin = new BehaviorSubject<boolean>(false);
  userToDisplay = new BehaviorSubject<UserToDisplay>({} as UserToDisplay);
  emptyUser: UserToDisplay = {
    id: "",
    email: "", 
    lastname: "",
    firstname: "",
    username: "",
    dateOfBirth: "",
    tel: "",
    roles: [""],
    department: "",
    contenthash: "",
  };

  userConnected: UserToDisplay = { } as UserToDisplay;

  constructor(
    private http : HttpClient,
    private toastService: ToastService,
    private router: Router
  ) { 
    const savedUserConnected = localStorage.getItem('user');
    if (savedUserConnected) {
      this.userToDisplay.next(JSON.parse(savedUserConnected));
    }
    const token = localStorage.getItem(this.keyToken);
    const admin = localStorage.getItem(this.keyRole);
    this.userIsLoggedIn.next(!!token);
    this.userIsAdmin.next(!!admin);
  }

  isLoggedIn() {
    return localStorage.getItem(this.keyToken) != null;
  }

  logIn(userToConnect: FormData) {
    //<LoginResponse>
    return this.http.post<any>(
      `${environment.backendUrl}/api/auth`, 
      userToConnect
    );
  }

  logOut() {
    if (this.isLoggedIn()) {
      this.unsetUserToDisplay();
      
      if (this.isLoggedIn()) this.toastService.warning("Erreur lors de la déconnection!");
      else this.toastService.success("Déconnexion réussie!");
      
      this.router.navigate(['/home']);
      


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

  isAdmin() {
    if ((localStorage.getItem(this.keyRole)  ?? '').search("ROLE_ADMIN") === -1) return false;
    else return true;
  }

  isEmployee() {
    if ((localStorage.getItem(this.keyRole) ?? '').search("ROLE_EMP") === -1) return false;
    else return true;
  }

  setSession(token: string, user: UserToDisplay) {
    localStorage.setItem(this.keyToken, token);
    localStorage.setItem(this.keyUser, JSON.stringify(user));
    localStorage.setItem(this.keyRole, JSON.stringify(user.roles));
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
    localStorage.removeItem(this.keyUser);
    //localStorage.clear();
    this.userIsLoggedIn.next(false);
    this.userIsAdmin.next(false);
    this.userToDisplay.next(this.emptyUser);
  }

  getToken(): string | null {
    return localStorage.getItem(this.keyToken);
  }

  setUserToDisplay(user: UserToDisplay, token: string) {
    this.userToDisplay.next(user);
    this.setSession(token, user);
    return this.userToDisplay.asObservable();
  }

  unsetUserToDisplay() {
    this.userToDisplay.next({} as UserToDisplay);
    this.unsetSession();
    return this.userToDisplay.asObservable();
  }

  getUserToDisplay() {
    return this.userToDisplay.asObservable();
  }

  getUserRoles(): string[] {
    const token = localStorage.getItem(this.keyToken);
    if (!token) return [];

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      return payload.roles || [];
    } catch (e) {
      return [];
    }
  }
}

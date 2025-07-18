import { Injectable } from '@angular/core';
import { UserToDisplay } from '../../interfaces/user.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/dev.environment';
import { BehaviorSubject } from 'rxjs';

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
    private http : HttpClient
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

  logOut() {
    const qparams = { 'id': 0 };
    return this.http.post<any>(
      `${environment.backendUrl}/api/logout`, 
      { /*params: qparams*/ }
    );
  }

  isAdmin() {
    return localStorage.getItem(this.keyRole) === "admin";
  }

  setSession(authToken: any) {
      localStorage.setItem(this.keyToken, authToken.token);
      localStorage.setItem(this.keyRole, authToken.role);
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
    }

  getToken(): string | null {
    return localStorage.getItem(this.keyToken);
  }

  setUserToDisplay(user: UserToDisplay) {
    //this.userToDisplay = user;
    this.userToDisplay.next(user);
    this.setSession(user.token);
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

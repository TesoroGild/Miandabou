import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/dev.environment';
import { User } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: User[] = [];
  readonly AUTHORIZATION: string = 'Authorization';

  constructor(
    private http: HttpClient
  ) { }

  getUsers(): any {

  }
  
  createUser(
    user: FormData
    //user: User,
    //picture: FormData
  ): any {
    // const headers = new HttpHeaders().set(
    //   this.AUTHORIZATION,
    //   `Bearer ${token}`
    // );
    return this.http.post<any>(
      `${environment.backendUrl}/api/users`, 
      user
    );
  }

  updateUser(user: FormData): any {
    
  }

  enableUser(id: FormData) {
    
  }

  disableUser(id: FormData) {
    
  }

  clearData() {
    this.users = [];
  }
}

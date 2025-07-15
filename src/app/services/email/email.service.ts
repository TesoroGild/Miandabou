import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/dev.environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(
    private http: HttpClient
  ) { }
  
  addEmail (mailToAdd: FormData) {
    return this.http.post<any>(
      `${environment.backendUrl}/api/email`, 
      mailToAdd
    )
  }

  sendEmail (mail: any) {
    
  }
}

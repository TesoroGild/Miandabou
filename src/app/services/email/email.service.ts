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

  sendEmail (mail: any) {}

   // async sendMail(email: string): Promise<any> {
  //   this.MS.setApiKey(process.env.SENDGRID_API_KEY);
  //   let retour: any;
  //   try {
  //     let data: Email = {
  //       from: 'mail@to.test',
  //       to: email,
  //       subject: 'SSVE : Resultats de simulation',
  //       text:
  //         'Cher client,' +
  //         '\n Merci de vous être abonné à notre infolettrage.\n'
  //     };
  //     retour = await this.MS.send(data);
  //     return retour;
  //   } catch (err) {
  //     console.error(err);
  //     throw new Error(err);
  //   }
  // }
}

import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

//Reusable components
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FootbarComponent } from './shared/components/footbar/footbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { environment } from '../environments/dev.environment';

@Component({
  selector: 'app-root',
  imports: [
    FootbarComponent, 
    NavbarComponent, 
    RouterOutlet,
    ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('Miandabou');
  //url: string = `https://maps.googleapis.com/maps/api/js?key=${environment.google_api_key}&libraries=places`;

  ngOnInit() {
    //this.loadGoogleMapsApi(this.url);
    initFlowbite();
  }

  // loadGoogleMapsApi(url: string) {
  //   return new Promise((resolve, reject) => {
  //     let script = document.createElement('script');
  //     script.type = 'text/javascript';
  //     script.src = url;
  //     script.async = true;
  //     document.getElementsByTagName('head')[0].appendChild(script);
  //     resolve(script);
  //   });
  // }

  // let autocomplete = new google.maps.places.Autocomplete(
  //   document.querySelector("#ship-address"), {
  //     componentRestrictions: { country: ["ca" , "us"] }
  //     fields: ['address_components', 'geometry', 'name'],
  //     types: ['address'],
  // });
}

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

//Reusable components
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FootbarComponent } from './shared/components/footbar/footbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';

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
export class App {
  protected readonly title = signal('Miandabou');

  ngOnInit() {
    initFlowbite();
  }

  let autocomplete = new google.maps.places.Autocomplete(
    document.querySelector("#ship-address"), {
      componentRestrictions: { country: ["ca" , "us"] }
      fields: ['address_components', 'geometry', 'name'],
      types: ['address'],
  });
}

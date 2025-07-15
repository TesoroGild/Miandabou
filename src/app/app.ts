import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

//Reusable components
import { Toast } from './shared/components/toast/toast';
import { Navbar } from './shared/components/navbar/navbar';
import { Footbar } from './shared/components/footbar/footbar';

@Component({
  selector: 'app-root',
  imports: [Toast, Footbar, Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Miandabou');

  ngOnInit() {
    initFlowbite();
  }
}

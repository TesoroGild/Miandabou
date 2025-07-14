import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { Navbar } from './components/navbar/navbar';
import { Footbar } from './components/footbar/footbar';

@Component({
  selector: 'app-root',
  imports: [Footbar, Navbar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Miandabou');

  ngOnInit() {
    initFlowbite();
  }
}

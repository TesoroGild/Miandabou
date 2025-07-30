import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

//Reusable components
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FootbarComponent } from './shared/components/footbar/footbar.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [
    FootbarComponent, 
    NavbarComponent, 
    RouterOutlet,
    ToastComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('Miandabou');
 
  constructor(public translate: TranslateService) { }

  ngOnInit() {
    initFlowbite();
  }
}

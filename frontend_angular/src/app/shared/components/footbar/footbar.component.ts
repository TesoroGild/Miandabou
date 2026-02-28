import { Component } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LangagesService } from '../../../services/langages/langages.service';

@Component({
  selector: 'app-footbar',
  imports: [TranslatePipe],
  templateUrl: './footbar.component.html',
  styleUrl: './footbar.component.scss'
})
export class FootbarComponent {
  constructor (
    private translateService: TranslateService,
    private langService: LangagesService,
  ) {
    this.translateService.use(this.langService.initLangage());
  }
}

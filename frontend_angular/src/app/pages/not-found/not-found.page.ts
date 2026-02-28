import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LangagesService } from '../../services/langages/langages.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterModule, TranslatePipe],
  templateUrl: './not-found.page.html',
  styleUrl: './not-found.page.scss'
})
export class NotFoundPage {
  constructor (
    private translateService: TranslateService,
    private langService: LangagesService
  ) {
    this.translateService.use(this.langService.initLangage());
  }
}

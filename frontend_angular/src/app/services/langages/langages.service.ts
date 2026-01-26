import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LangagesService {
  constructor(
    private translateService: TranslateService
  ) { }
  initLangage() : string {
    if (localStorage.getItem('lang') !== null) {
      //this.translateService.use(localStorage.getItem('lang')!);
      return localStorage.getItem('lang')!;
    } else {
      const browserLang = this.translateService.getBrowserLang();
      if (browserLang !== undefined) {
        //this.translateService.use(browserLang.match(/en|fr|es/) ? browserLang : 'fr');
        localStorage.setItem('lang', browserLang.match(/en|fr|es/) ? browserLang : 'fr');
        return browserLang.match(/en|fr|es/) ? browserLang : 'fr';
      } else {
        //this.translateService.use('fr');
        localStorage.setItem('lang', 'fr');
        return 'fr';
      }
    };
  }

  changeLanguage (lang: string) {
    if (this.translateService.getCurrentLang() === lang) return;
    localStorage.removeItem('lang');
    localStorage.setItem('lang', lang);
    this.translateService.use(lang);
  }
}

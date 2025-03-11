import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: false
})
export class AccountPage implements OnInit {

  selectedLang: any;

  constructor(
    private commonService : CommonService,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
  }

  onSelectLanguage(lang: any) {
    console.log('Lan', lang);
    localStorage.setItem('language', lang);
    this.commonService.languageEvent.next(lang);
    this.translateService.use(lang);
  }

}

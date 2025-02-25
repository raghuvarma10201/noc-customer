import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { NocService } from './services/noc.service';
import { SharedService } from './services/shared.service';
import { ToastService } from './services/toast.service';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  deviceInfo: any;
  errorMsg: any;
  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    public router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private commonService: CommonService,
    private nocService: NocService,
    private route: ActivatedRoute
  ) {
    this.translate.setDefaultLang('en'); // Default language
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|es/) ? browserLang : 'en');

  }

  switchLanguage(lang: string) {
    localStorage.setItem('language', lang);
    this.translate.use(lang);
  }
  ngOnInit() {
    this.getDeviceInfo();
    this.getDefaultSettings();
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      this.translate.use(savedLang);
    }
  }
  async getDeviceInfo() {
    this.deviceInfo = await Device.getInfo();
    console.log('Device Info:', this.deviceInfo);

  }
  async getDefaultSettings() {
    this.commonService.getDefaultSettings().pipe(finalize(() => {
    })).subscribe((res: any) => {
      console.log("Res", res);
      if (res.status == 200 && res.success == true) {
        this.loaderService.loadingDismiss();
      }
      else {
        this.loaderService.loadingDismiss();
        this.toastService.showError(res.message, "Error");
      }
    }, error => {
      this.loaderService.loadingDismiss();
      this.errorMsg = error;
      console.log(this.errorMsg, "getDefaultSettings Error");
    })
  }
}

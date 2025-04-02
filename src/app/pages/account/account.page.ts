import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { jwtDecode } from 'jwt-decode';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { LoaderService } from 'src/app/services/loader.service';
import { NocService } from 'src/app/services/noc.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toast.service';
import { TranslationService } from 'src/app/services/translation.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: false
})
export class AccountPage implements OnInit {

  selectedLang: any;
  username: any;
  email: any;
  role: any;
  languages: any;
  errorMsg: any;
  selectedLanguageId: string = '';
  constructor(
    private commonService: CommonService,
    private translateService: TranslateService,
    private router: Router,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private nocService: NocService,
    private activatedRouteService: ActivatedRoute,
    private authService: AuthService,
    private translationService: TranslationService,
  ) { 
    
  }

  ngOnInit() {
    this.selectedLanguageId =  JSON.stringify(localStorage.getItem('language')) || '1';
    this.getLanguages();
    this.getNameIdentifier();
  }

  onSelectLanguage(lang: any) {
    console.log('Lan', lang);
    localStorage.setItem('language', lang);
    this.commonService.languageEvent.next(lang);
    this.translateService.use(lang);
  }
  async getLanguages() {
    
    await this.loaderService.loadingPresent();
    this.commonService.getLanguages().pipe(finalize(() => {
      this.loaderService.loadingDismiss();
    })).subscribe((res: any) => {
      console.log("Res", res);
      if (res.status == 200 && res.success == true) {
        this.languages = res.data;
        this.loaderService.loadingDismiss();
      }
      else {
        this.loaderService.loadingDismiss();
        this.toastService.showError(res.message, "Error");
      }
    }, error => {
      this.loaderService.loadingDismiss();
      this.errorMsg = error;
      this.toastService.showError('Something went wrong', "Error");
    })
  }
  handleLanguageChange(event: any) {
    this.selectedLanguageId = event.detail.value;
    localStorage.setItem('language', event.detail.value);
    this.translationService.loadTranslationsFromAPI(event.detail.value);
    //this.translate.use(this.selectedLanguageId);
  }
  getNameIdentifier(): any {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const decodedToken: any = jwtDecode(token);
      this.username = decodedToken?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
      this.email = decodedToken?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || null;
      this.role = decodedToken?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null;
      console.log("username", this.username);
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

  logout() {
    const keysToKeep = ['device_token', 'username', 'password', 'rememberMe', 'app_name', 'app_version'];
    const savedValues = keysToKeep.map(key => ({ key, value: localStorage.getItem(key) }));
    localStorage.clear();
    savedValues.forEach(({ key, value }) => {
      if (value !== null) {
        localStorage.setItem(key, value);
      }
    });
    this.router.navigate(['/login']);
  }

}

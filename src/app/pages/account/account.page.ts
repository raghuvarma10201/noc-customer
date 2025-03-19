import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { jwtDecode } from 'jwt-decode';
import { CommonService } from 'src/app/services/common.service';


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

  constructor(
    private commonService : CommonService,
    private translateService: TranslateService,
    private router : Router
  ) { }

  ngOnInit() {
    this.getNameIdentifier();
  }

  onSelectLanguage(lang: any) {
    console.log('Lan', lang);
    localStorage.setItem('language', lang);
    this.commonService.languageEvent.next(lang);
    this.translateService.use(lang);
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

    logout(){
      const keysToKeep = ['device_token', 'username', 'password','rememberMe','app_name','app_version'];
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

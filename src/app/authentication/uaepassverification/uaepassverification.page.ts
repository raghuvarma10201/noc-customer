import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastService } from 'src/app/services/toast.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-uaepassverification',
  templateUrl: './uaepassverification.page.html',
  styleUrls: ['./uaepassverification.page.scss'],
  standalone: false
})
export class UaepassverificationPage implements OnInit {
  queryParams: any;
  userInfo: any;

  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private authService: AuthService,
    private toastService: ToastService
    
  ) {
    const navigation: any = this.router.getCurrentNavigation();
    this.queryParams = navigation?.extras.state;
    console.log("query params", this.queryParams);
   }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state;
    
    if (state && state['authorization_code']) {
      this.getAccessToken(state['authorization_code']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  async getAccessToken(authorizationCode: string) {
    try {
      await this.loaderService.loadingPresent();
      
      const username = environment.username;
      const password = environment.password;
      const credentials = `${username}:${password}`;
      const creds = btoa(credentials);
      
      this.authService.getaccesstoken(authorizationCode, creds).pipe(
        finalize(() => {
          // You probably want to dismiss the loader here, not present it again
          this.loaderService.loadingDismiss();
        })
      ).subscribe(
        (response: any) => {
          if (response && response.access_token) {
            console.log("access token response", response);
            this.getUserInfo(response.access_token);
          } else {
            this.toastService.showError('Failed to get access token', 'Error');
            this.router.navigate(['/login']);
          }
        },
        (error: any) => {
          console.error(error);
          this.toastService.showError('Authentication failed', 'Error');
          this.router.navigate(['/login']);
        }
      );
    } catch (error) {
      console.error(error);
      this.loaderService.loadingDismiss();
      this.router.navigate(['/login']);
    }
  }

  getUserInfo(token: string) {
    this.authService.uaeuserInfo(token).pipe(
      finalize(() => {
        this.loaderService.loadingDismiss();
      })
    ).subscribe(
      (response: any) => {
        console.log("response in userinfo", response);
        if (response?.email) {
          this.userInfo = response;
          const payload = {
            UserName : response?.email,
            Password : '',
            IsAdminPortal : false,
            EmiratesId : response?.idn ? response?.idn : '',
            Type : 'CUST'
          };
          
          this.validateUser(payload);
        } else {
          this.toastService.showError('Failed to get user information', 'Error');
          this.router.navigate(['/login']);
        }
      },
      (error : any) => {
        console.error(error);
        this.toastService.showError('Failed to get user information', 'Error');
        this.router.navigate(['/login']);
      }
    );
  }

  validateUser(payload: any) {
    this.authService.validateuaeUser(payload).subscribe(
      (res: any) => {
        if (res.status == 200 && res.success == true) {
          // User exists, proceed with login
  
          const userData = res;
          console.log("user data", userData);
          this.authService.setUserInLocalStorage(userData, 'userData');
          
          this.toastService.showSuccess('Successfully authenticated with UAE Pass', 'Success');
          this.router.navigate(['/dashboard']);
        } else {
          // User doesn't exist - show error instead of registration form
          this.toastService.showError('User not authorized. Please contact support.', 'Error');
          this.router.navigate(['/login']);
        }
      },
      (error) => {
        console.error(error);
        this.toastService.showError('Authentication failed', 'Error');
        this.router.navigate(['/login']);
      }
    );
  }


}

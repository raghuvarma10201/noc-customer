import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toast.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { environment } from 'src/environments/environment';
import { Browser } from '@capacitor/browser';
import { InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  errorMsg: any;
  isClicked: boolean = false;
  initailType: string = 'password';
  captchaResponse: string | any;
  captcha: string = '';
  userInput: string = '';
  validationMessage: string = '';
  isCaptchaValid: boolean = false;
  intervalId: any;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private authService: AuthService,
    private activatedRouteService: ActivatedRoute,
    private inAppBrowser: InAppBrowser,
    private cdRef: ChangeDetectorRef 
  ) { 
    this.refreshCaptcha();
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    if(token && userData){
      this.router.navigate(['/dashboard']);
    }
  }
  get form() { return this.loginForm.controls; }
  
  // Generate new CAPTCHA
  refreshCaptcha() {
    this.captcha = this.generateCaptcha();
    this.userInput = '';
    this.validationMessage = '';
  }

  // Generate a random 6-digit number
  generateCaptcha(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Validate user input
  validateCaptcha() {
    if (this.userInput === this.captcha) {
      this.isCaptchaValid = true;
      this.validationMessage = 'CAPTCHA Verified Successfully!';
      return true;
    } else {
      this.isCaptchaValid = false;
      this.validationMessage = 'Incorrect CAPTCHA. Please try again.';
      return false;
    }
  }
  onCaptchaResolved(response: string): void {
    this.captchaResponse = response;
  }
  async onSubmit() {
    this.submitted = true;
    console.log(this.loginForm.value);
    await this.loaderService.loadingPresent();
    if (this.loginForm.invalid) {
      this.loaderService.loadingDismiss();
      return;
    }
    console.log(this.validateCaptcha());
    if(!this.validateCaptcha()){
      this.toastService.showError(this.validationMessage, "Error");
      this.loaderService.loadingDismiss();
      return;
    }
    let formData = this.loginForm.value;
    formData.isAdminPortal= false;
    formData.Type = "CUST";
    this.authService.validateUser(formData).pipe(finalize(() => {
      this.loaderService.loadingDismiss();
     })).subscribe((res: any) => {
      console.log("Res", res);
      if(res.status == 200 && res.success == true){
        this.submitted = false;
        const accessToken = res.data;
        const userData = this.authService.decodeToken(accessToken);
        console.log("accessToken---->",accessToken);
        // this.toastService.showSuccess('Successfully Login', 'Success');
        this.authService.setUserInLocalStorage(userData,'userData');
        localStorage.setItem('accessToken', accessToken);
        this.loginForm.reset();
        this.refreshCaptcha();
        this.router.navigate(["/dashboard"]);
        this.sharedService.isUserLogin.next({isUserLoggedIn:true});
      }
      else{    
        this.refreshCaptcha();
        this.toastService.showError(res.message, "Error");
      }
    }, error => {
      this.errorMsg = error;
      this.toastService.showError(this.errorMsg, "Error");
     })
  }

  showOrHidePassword(){
    if(this.isClicked===true){
      this.isClicked=false
      this.initailType="text"
    }
    else if (this.isClicked===false){
      this.isClicked=true
      this.initailType="password"
    }
  }

  reset(){
    this.loginForm.reset();
    this.generateCaptcha();
  }

  navigatetoUae(){
    const options: InAppBrowserOptions = {
      location: 'yes',
      clearcache: 'yes' as 'yes',
      zoom: 'yes' as 'yes',
      toolbarposition: 'top',
      clearsessioncache: 'yes' as 'yes',
      hideurlbar: 'no' as 'no',
      closebuttoncaption: 'Close',
      hidenavigationbuttons: 'no' as 'no',
      hardwareback: 'yes' as 'yes'
    };
    const browser = this.inAppBrowser.create(
      'https://stg-id.uaepass.ae/idshub/authorize?response_type=code&client_id=rakpsd_mobile_stage&scope=urn:uae:digitalid:profile:general&state=HnlHOJTkTb66Y5H&redirect_uri=http://localhost/uaepassverification&acr_values=urn:safelayer:tws:policies:authentication:level:low',
      '_self',  // Change this from '_self' to '_blank'
        options
    );

    browser.on('loadstart').subscribe(async (event) => {
      // Check for authentication URL
      if (event.url.includes('authenticationendpoint/login.do')) {
        // This is the login URL
        if (event.url.includes('error=access_denied')) {
          console.log('User canceled the authentication.');
          // Handle the access denied error (e.g., show a message to the user)
        } else {
          console.log('Login URL with possible params:', event.url);
          // Handle the login redirection (e.g., start authentication process)
        }
      }
      // Check for polling URL
      else if (event.url.includes('authenticationendpoint/polling.jsp')) {
        // This is the polling URL
        console.log('Polling URL:', event.url);
        // Handle the polling response (e.g., check for successful authentication)
      }
      // Check for retry URL
      else if (event.url.includes('authenticationendpoint/retry.do')) {
        // This is the retry URL
        this.toastService.showError('Please try again','');
        //await browser.close();
        this.router.navigate(['/login'])
        console.log('Retry URL:', event.url);
        // Handle retry logic (e.g., show retry message or re-trigger authentication)
      }
      // Check for redirect URL with error
      else if (event.url.includes('uaepassverification')) {
        if (event.url.includes('localhost/uaepassverification')) {

          const urlParams = new URLSearchParams(event.url.split('?')[1]);
          const code = urlParams.get('code');

          if (code) {
            console.log('Authorization code:', code);

            // Retrieve credentials
            const username = environment.username;
            const password = environment.password;

            // Close the browser
            await browser.close();

            // Navigate to the verification page
            this.router.navigate(['/uaepassverification'],
              {
                state : {
                  from: 'uaepassverification',
                  authorization_code: code,
                  user_name: username,
                  password: password,
                }
              });
          } else {
            // This is the redirection URL after authentication
            const urlParams = new URLSearchParams(new URL(event.url).search);
            const error = urlParams.get('error');
            const errorDescription = urlParams.get('error_description');
            if (error === 'access_denied') {
              console.log('Authentication was canceled by user on UAE PASS app.');
              this.toastService.showError(errorDescription,'');
              await browser.close();
              this.router.navigate(['/login']);
              // Handle error (e.g., show an appropriate message to the user)
            } else if (error) {
              console.log('Error:', error, 'Description:', errorDescription);
              this.toastService.showError(errorDescription,'');
              await browser.close();
              this.router.navigate(['/login']);
              // Handle other error cases (e.g., display error message)
            } else {
              this.toastService.showError(errorDescription,'');
              await browser.close();
              this.router.navigate(['/login']);
            }
          }
        }

      }
      else {
        console.log('Unknown URL:', event.url);
      }

      console.log('Page loading started:', event.url);
    });

  }
}

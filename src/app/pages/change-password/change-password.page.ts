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
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  passwordForm: FormGroup;
  submitted = false;
  errorMsg: any;
  isClicked: boolean = false;
  initailType: string = 'password';
  captchaResponse: string | any;
  captcha: string = '';
  userInput: string = '';
  validationMessage: string = '';
  isCaptchaValid: boolean = false;
  rememberMe : boolean = false;
  intervalId: any;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef 
  ) { 
    this.refreshCaptcha();
    this.passwordForm = this.fb.group({
      currentPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    },{ validators: this.passwordsMatchValidator });
  }
  passwordsMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }
  ngOnInit() {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('userData');
    
  }
  get form() { return this.passwordForm.controls; }


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
    console.log(this.passwordForm.value);
    await this.loaderService.loadingPresent();
    if (this.passwordForm.invalid) {
      this.loaderService.loadingDismiss();
      return;
    }
    console.log(this.validateCaptcha());
    if(!this.validateCaptcha()){
      this.toastService.showError(this.validationMessage, "Error");
      this.loaderService.loadingDismiss();
      return;
    }
    
    let formData = this.passwordForm.value;
    if (this.rememberMe) {
      localStorage.setItem("username", formData.username);
      localStorage.setItem("password", formData.password);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("rememberMe");
    }
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
        this.passwordForm.reset();
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
  forgotPassword(){
    this.router.navigate(['/forgot-password']);
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
    this.passwordForm.reset();
    this.generateCaptcha();
  }
}

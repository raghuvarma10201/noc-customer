import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toast.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
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
    this.loginForm = this.fb.group({
      email: [null, [Validators.required]]
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

  ionViewDidEnter() {

    // Your logic here
  }

  async onSubmit() {
    this.submitted = true;
    console.log(this.loginForm.value);
    await this.loaderService.loadingPresent();
    if (this.loginForm.invalid) {
      this.loaderService.loadingDismiss();
      return;
    }
    let formData = this.loginForm.value;
    this.authService.verifyEmail(formData.email).pipe(finalize(() => {
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
        this.router.navigate(["/dashboard"]);
        this.sharedService.isUserLogin.next({isUserLoggedIn:true});
      }
      else{    
        this.toastService.showError(res.message, "Error");
      }
    }, error => {
      this.errorMsg = error;
      this.toastService.showError('Something went wrong', "Error");
     })
  }
  login(){
    this.router.navigate(['/login']);
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

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toast.service';

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
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private authService: AuthService,
    private activatedRouteService: ActivatedRoute
  ) { 
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
  

  onCaptchaResolved(response: string): void {
    this.captchaResponse = response;
  }
  async onSubmit() {
    console.log(this.loginForm.value);
    await this.loaderService.loadingPresent();
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.loaderService.loadingDismiss();
      return;
    }
   
    this.authService.validateUser(this.loginForm.value).pipe(finalize(() => {
      this.loaderService.loadingDismiss();
     })).subscribe((res: any) => {
      console.log("Res", res);
      if(res.status == 200 && res.success == true){
        const accessToken = res.data;
        const userData = this.authService.decodeToken(accessToken);
        console.log("accessToken---->",accessToken);
        this.toastService.showSuccess('Successfully Login', 'Success');
        this.authService.setUserInLocalStorage(userData,'userData');
        localStorage.setItem('accessToken', accessToken);
        this.router.navigate(["dashboard"]);
        this.sharedService.isUserLogin.next({isUserLoggedIn:true});
      }
      else{     
        this.loaderService.loadingDismiss();
        // this.toastr.showError(result.message, "Error");
      }
    }, error => {   
      this.loaderService.loadingDismiss();
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
}

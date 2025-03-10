import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { NocService } from 'src/app/services/noc.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-completed-noc',
  templateUrl: './completed-noc.page.html',
  styleUrls: ['./completed-noc.page.scss'],
  standalone: false
})
export class CompletedNocPage implements OnInit {

 errorMsg: any;
  nocList: any = [];
  encryptedUserType: any;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private nocService: NocService,
    private activatedRouteService: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.encryptuserType();
  }

  encryptuserType() {
    this.nocService.getEncryptedString("Completed").pipe(finalize(() => {
    })).subscribe((res: any) => {
      console.log("ResEncrypted", res);

      if (res.status == 200 && res.success == true) {
        this.encryptedUserType = res.data;
        this.fetchNOCList(this.encryptedUserType);
      }
      else {
        this.loaderService.loadingDismiss();
        this.toastService.showError(res.message, "Error");
      }
    }, error => {
      this.loaderService.loadingDismiss();
      this.errorMsg = error;
      this.toastService.showError(this.errorMsg, "Error");
    })
  }

  async fetchNOCList(userType: string) {
    await this.loaderService.loadingPresent();
    this.nocService.getNocs(userType).pipe(finalize(() => {
      this.loaderService.loadingDismiss();
    })).subscribe((res: any) => {
      console.log("Res", res);
      if (res.status == 200 && res.success == true) {
        this.nocList = res.data;
        this.loaderService.loadingDismiss();
      }
      else {
        this.loaderService.loadingDismiss();
        this.toastService.showError(res.message, "Error");
      }
    }, error => {
      this.loaderService.loadingDismiss();
      this.errorMsg = error;
      this.toastService.showError(this.errorMsg, "Error");
    })
  }
  doRefresh(event: any) {
    console.log('Refreshing data...');

    // Simulate async data fetching
    setTimeout(() => {
      // Add new item or refresh your data
      this.fetchNOCList('UnderProcess');

      // Complete the refresher animation
      event.target.complete();
      console.log('Refresh complete');
    }, 2000); // Simulate 2 seconds refresh time
  }

  logout(){
    this.authService.logout();
  }
}

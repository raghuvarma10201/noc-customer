import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { NocService } from 'src/app/services/noc.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-list-noc',
  templateUrl: './list-noc.page.html',
  standalone: false,
  styleUrls: ['./list-noc.page.scss'],
})
export class ListNocPage implements OnInit {
  errorMsg: any;
  nocList: any = [];
  encryptedUserType: any;
  userType: string | null;
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private nocService: NocService,
    private activatedRouteService: ActivatedRoute
  ) { 
    this.userType = this.activatedRouteService.snapshot.paramMap.get('userType');
    console.log('User Type:', this.userType);
  }

  ngOnInit() {
    this.encryptuserType(this.userType);
  }

  encryptuserType(userType: any) {
    this.nocService.getEncryptedString(userType).pipe(finalize(() => {
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
      if(res.status == 200 && res.success == true){
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
      this.fetchNOCList(this.encryptedUserType);

      // Complete the refresher animation
      event.target.complete();
      console.log('Refresh complete');
    }, 2000); // Simulate 2 seconds refresh time
  }
  navigateToDisplayPage(nocId : any) {
    if (nocId) {
      this.router.navigate(['/noc-details', nocId]);
    } else {
      console.warn('Please select a date and time first!');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { NocService } from 'src/app/services/noc.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  standalone: false,
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  id: string | null = null;

  nocDetails: any;
  encryptedNocId: string = '';
  errorMsg: any;
  isTrailPitEnabled: boolean = false;
  isAsphaltEnabled: boolean = false;
  nocStatus: string = '';
  constructor(
    private fb: FormBuilder,
    public router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private nocService: NocService,
    private route: ActivatedRoute
  ) {
    
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.id = params.get('id');
      console.log('Updated ID:', this.id);
      await this.loaderService.loadingPresent();
      this.nocService.getEncryptedString(params.get('id')).pipe(finalize(() => {
        this.loaderService.loadingDismiss();
      })).subscribe((res: any) => {
        console.log("ResEncrypted", res);
        
        if (res.status == 200 && res.success == true) {
          this.fetchNOCDetails(res.data);
          this.encryptedNocId = res.data;
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
      //this.fetchNOCDetails();

    });
  }
  async fetchNOCDetails(encryptedNocId : any) {
    await this.loaderService.loadingPresent();
    this.nocService.getNocDetails(encryptedNocId).pipe(finalize(() => {
      this.loaderService.loadingDismiss();
    })).subscribe((res: any) => {
      console.log("Res", res);
      if (res.status == 200 && res.success == true) {
        this.nocDetails = res.data;
        this.nocStatus = res.data.nocStatus;
        const arr = res.data.customerActionId.split(",");
        console.log("arr",arr);
        if(res.data.nocStatusId == 4){
          if(arr.includes("2")){
            this.isTrailPitEnabled = true;
          }
          if(arr.includes("3")){
            this.isAsphaltEnabled = true;
          }
        }
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
  navigateToTraiPitForm(nocData : any) {
    if (nocData) {
      nocData.customerActionId = 2;
      this.router.navigate(['/trialpit-form'], { state: { nocData: nocData } });
    } else {
      console.warn('Please select a date and time first!');
    }
  }
  navigateToTraiPitDetails(nocData : any) {
    if (nocData) {
      nocData.customerActionId = 2;
      this.router.navigate(['/trial-pit-details'], { state: { nocData: nocData, encryptedNocId : this.encryptedNocId } });
    } else {
      console.warn('Please select a date and time first!');
    }
  }
  navigateToAsphaltForm(nocData : any) {
    if (nocData) {
      nocData.customerActionId = 3;
      this.router.navigate(['/asphalt-form'], { state: { nocData: nocData } });
    } else {
      console.warn('Please select a date and time first!');
    }
  }
  navigateToAsphaltDetails(nocData : any) {
    if (nocData) {
      nocData.customerActionId = 2;
      this.router.navigate(['/asphalt-details'], { state: { nocData: nocData, encryptedNocId : this.encryptedNocId } });
    } else {
      console.warn('Please select a date and time first!');
    }
  }
}

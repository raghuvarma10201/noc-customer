import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'src/app/services/loader.service';
import { NocService } from 'src/app/services/noc.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastService } from 'src/app/services/toast.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { AlertController, IonModal } from '@ionic/angular';
import { CommonService } from 'src/app/services/common.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-building-inspection-details',
  standalone: false,
  templateUrl: './building-inspection-details.page.html',
  styleUrls: ['./building-inspection-details.page.scss'],
})
export class BuildingInspectionDetailsPage implements OnInit {

@ViewChild('rescheduleModal') rescheduleModal!: IonModal;

submitted = false;
errorMsg: any;
imageFiles: File[] = [];
imagePreviews: string[] = []; // Stores image preview URLs
selectedDate: string | null = null;
selectedTime: string | null = null;
latitude: any;
longitude: any;
nocDetails: any;
trialPitDetails: any[] = [];
encryptedNocId: any;
imgUrl: any = environment.imgUrl;
rescheduleForm: FormGroup;
isSubmitting = false;
rescheduleLimit: any;
rescheduledCount: any;
imageLimit : any;
constructor(
  private translate: TranslateService,
  private fb: FormBuilder,
  public router: Router,
  private loaderService: LoaderService,
  private toastService: ToastService,
  private sharedService: SharedService,
  private nocService: NocService,
  private activatedRouteService: ActivatedRoute,
  private geolocationService: GeolocationService,
  private datePipe: DatePipe,
  private commonService: CommonService,
  private alertCtrl: AlertController,
  private authService: AuthService
) {
  const navigation = this.router.getCurrentNavigation();
  if (navigation?.extras.state) {
    const nocData = navigation.extras.state['nocData'];
    this.nocDetails = nocData;
    this.encryptedNocId = navigation.extras.state['encryptedNocId'];; 
    console.log(this.encryptedNocId,"encryptedNocId");
  }
  this.rescheduleForm = this.fb.group({
    comments: [''],
    datetime: ['', Validators.required]
  });
  const defaultSettings = localStorage.getItem('defaultSettings');
  if (defaultSettings) {
    try {
      const parsedSettings = JSON.parse(defaultSettings);
      
      // Find the setting with configKey 'limitForReschedule'
      const rescheduleSetting = parsedSettings.find((item: any) => item.configKey === 'limitForReschedule');
      const imagesSetting = parsedSettings.find((item: any) => item.configKey === 'limitForUploadPictures');
      
      if (rescheduleSetting) {
        this.rescheduleLimit = Number(rescheduleSetting.configValue); // Convert to number if needed
      } else {
        console.warn("Reschedule limit config not found");
      }
      if (imagesSetting) {
        this.imageLimit = Number(rescheduleSetting.configValue); // Convert to number if needed
      } else {
        console.warn("Image limit config not found");
      }
    } catch (error) {
      console.error("Error parsing defaultSettings:", error);
    }
  } else {
    console.warn("No defaultSettings found in localStorage");
  }

}

ngOnInit(): void {
  
}
ionViewWillEnter() {
  this.fetchNOCDetails(this.encryptedNocId);
  this.fetchNOCList();
}
async fetchNOCList() {
  await this.loaderService.loadingPresent();

  this.nocService.getComments(this.encryptedNocId, 5).pipe(finalize(() => {
    this.loaderService.loadingDismiss();
  })).subscribe((res: any) => {
    console.log("Res", res);
    if(res.status == 200 && res.success == true){
      this.trialPitDetails = res.data;
      console.log("TrialPitDetails", this.trialPitDetails);
      this.rescheduledCount = this.trialPitDetails.filter(item => item.rescheduled === true && item.roleId == 2).length;
      console.log("RescheduledCount", this.rescheduledCount);
      this.loaderService.loadingDismiss(); 
    }else {
      this.loaderService.loadingDismiss();
      this.toastService.showError(res.message, "Error");
    }
  }, error => {
    this.loaderService.loadingDismiss();
    this.errorMsg = error;
    this.toastService.showError('Something went wrong', "Error");
  })
}
async getCurrentLocation() {
  const location = await this.geolocationService.getCurrentLocation();
  if (location) {
    this.latitude = location.latitude;
    this.longitude = location.longitude;
    console.log('Current position:', this.latitude, this.longitude);
  } else {
    console.warn('Could not retrieve location');
  }
}
reschedule(nocData : any) {
  if(this.rescheduledCount >= this.rescheduleLimit){
    this.toastService.showError('The maximum limit for rescheduling has been reached.', 'Error');
    return;
  }
  if (nocData) {
   // nocData.customerActionId = 2;
   nocData.customerActionId = 5;
    this.router.navigate(['/building-inspection-reschedule'], { state: { nocData: nocData } });
  } else {
    console.warn('Please select a date and time first!');
  }
}
addComments(nocData : any) {
  if (nocData) {
    this.router.navigate(['/comments'], { state: { nocData: nocData,encryptedNocId : this.encryptedNocId, customerActionId : 5 } });
  } else {
    console.warn('Please select a date and time first!');
  }
}

formatTime(time: string | null | undefined): string {
  if (!time) {
    return ''; // Return an empty string if the time is null/undefined
  }
  return this.datePipe.transform(`1970-01-01T${time}`, 'h:mm a') || '';
}



async confirmAccept(data: any) {
  const alert = await this.alertCtrl.create({
    header: 'Confirmation',
    message: 'Are you sure you want to accept this request?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary'
      }, 
      {
        text: 'Yes, Accept',
        handler: () => {
          this.acceptRequest(data);
        }
      }
    ]
  });

  await alert.present();
}

acceptRequest(data: any) {
  const requestBody = {
    NocId: data.nocId,
    TrailOrRoadCutId: this.nocDetails.trailPitId,
    CustomerActionTypeid: 5,
    IsAccepted: true
  };
  this.commonService.acceptTrailPitOrRoadCutting(requestBody).subscribe(
    (res: any) => {
      if (res.status === 200 && res.success) {
        this.toastService.showSuccess('Request accepted successfully', 'Success');
        this.fetchNOCList(); // Refresh the list after accepting
      } else {
        this.toastService.showError(res.message || 'Failed to accept request', 'Error');
      }
    }
  );
}

async fetchNOCDetails(encryptedNocId : any) {
  this.nocService.getNocDetails(encryptedNocId).pipe(finalize(() => {
  })).subscribe((res: any) => {
    console.log("Res", res);
    if (res.status == 200 && res.success == true) {
      this.nocDetails = res.data;
    }
    else {
      this.toastService.showError(res.message, "Error");
    }
  }, error => {
    this.errorMsg = error;
    this.toastService.showError('Something went wrong', "Error");
  })
}
logout(){
  this.authService.logout();
}


}

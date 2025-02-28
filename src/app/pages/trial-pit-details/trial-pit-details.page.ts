import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-trial-pit-details',
  standalone: false,
  templateUrl: './trial-pit-details.page.html',
  styleUrls: ['./trial-pit-details.page.scss'],
})
export class TrialPitDetailsPage implements OnInit {

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
    private datePipe: DatePipe
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const nocData = navigation.extras.state['nocData'];
      this.nocDetails = nocData;
      this.encryptedNocId = navigation.extras.state['encryptedNocId'];; 
      console.log(this.encryptedNocId,"encryptedNocId");
    }

  }

  ngOnInit(): void {
    
  }
  ionViewWillEnter() {
    this.fetchNOCList();
  }
  async fetchNOCList() {
    await this.loaderService.loadingPresent();

    this.nocService.getComments(this.encryptedNocId, 2).pipe(finalize(() => {
      this.loaderService.loadingDismiss();
    })).subscribe((res: any) => {
      console.log("Res", res);
      if(res.status == 200 && res.success == true){
        this.trialPitDetails = res.data;
        console.log("TrialPitDetails", this.trialPitDetails[0].activeStatusName);
        this.loaderService.loadingDismiss(); 
      }else {
        this.loaderService.loadingDismiss();
        this.toastService.showError(res.message, "Error");
      }
    }, error => {
      this.loaderService.loadingDismiss();
      this.errorMsg = error;
      this.toastService.showError(this.errorMsg, "Error");
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
    if (nocData) {
      nocData.customerActionId = 2;
      this.router.navigate(['/trialpit-reschedule'], { state: { nocData: nocData } });
    } else {
      console.warn('Please select a date and time first!');
    }
  }
  addComments(nocData : any) {
    if (nocData) {
      this.router.navigate(['/comments'], { state: { nocData: nocData,encryptedNocId : this.encryptedNocId, customerActionId : 2 } });
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
  
}

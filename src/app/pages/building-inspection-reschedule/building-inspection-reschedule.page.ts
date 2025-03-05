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
@Component({
  selector: 'app-building-inspection-reschedule',
  templateUrl: './building-inspection-reschedule.page.html',
  standalone: false,
  styleUrls: ['./building-inspection-reschedule.page.scss'],
})
export class BuildingInspectionReschedulePage implements OnInit {

  trailPitRescheduleForm: FormGroup;
  submitted = false;
  errorMsg: any;
  selectedDate: string | null = null;
  selectedTime: string | null = null;
  latitude: any;
  longitude: any;
  nocDetails: any;
  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    public router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private sharedService: SharedService,
    private nocService: NocService,
    private activatedRouteService: ActivatedRoute,
    private geolocationService: GeolocationService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const nocData = navigation.extras.state['nocData'];
      this.nocDetails = nocData;
      console.log(nocData);
    }
    this.trailPitRescheduleForm = this.fb.group({
      id: [this.nocDetails.trailPitId, [Validators.required]],
      comments: [null, [Validators.required]],
      date_time: [null, [Validators.required]],
      inspectionDate: [null, [Validators.required]],
      inspectionTime: [null, [Validators.required]],
      //image: [null, [Validators.required]]
    });
  }

  ngOnInit() {

  }

  get form() { return this.trailPitRescheduleForm.controls; }

  onDateTimeChange(event: any) {
    const fullDateTime = event.detail.value; // Example: "2023-11-02T01:22:00"

    if (fullDateTime) {
      const dateTime = new Date(fullDateTime);

      this.selectedDate = dateTime.toISOString().split('T')[0]; // "2023-11-02"
      this.selectedTime = dateTime.toTimeString().split(' ')[0].substring(0, 8); // "01:22"

      console.log('Selected Date:', this.selectedDate);
      console.log('Selected Time:', this.selectedTime);

      this.trailPitRescheduleForm.patchValue({
        inspectionDate: this.selectedDate, // Must match all form controls
        inspectionTime: this.selectedTime,
      });
    }
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
  async onSubmit() {
    this.submitted = true;
    console.log(this.trailPitRescheduleForm.value);
    await this.loaderService.loadingPresent();
    if (this.trailPitRescheduleForm.invalid) {
      this.loaderService.loadingDismiss();
      return;
    }
    const location = await this.geolocationService.getCurrentLocation();
    if (location) {
      this.latitude = location.latitude;
      this.longitude = location.longitude;
      console.log('Current position:', this.latitude, this.longitude);
    } else {
      console.warn('Could not retrieve location');
    }
    const formData = this.trailPitRescheduleForm.value;
    // Append form fields to FormData

    // Append location coordinates if available
    if (this.latitude && this.longitude) {
      formData.latitude = this.latitude.toString();
      formData.longitude = this.longitude.toString();
    }

    this.nocService.rescheduleBuildingInspection(formData).pipe(finalize(() => {
      this.loaderService.loadingDismiss();
    })).subscribe((res: any) => {
      console.log("Res", res);
      if (res.status == 200 && res.success == true) {
        this.toastService.showSuccess(res.message, "Scccess");
        this.router.navigate(['/trial-pit-details'], { state: { nocData: this.nocDetails } });
      }
      else {
        this.toastService.showError(res.message, "Error");
      }
    }, (error: any) => {
      this.errorMsg = error;
      // this.toastService.showError(this.errorMsg, "Error");
    })
  }
}

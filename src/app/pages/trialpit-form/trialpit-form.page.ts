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
  selector: 'app-trialpit-form',
  standalone: false,
  templateUrl: './trialpit-form.page.html',
  styleUrls: ['./trialpit-form.page.scss'],
})
export class TrialpitFormPage implements OnInit {

  trailPitForm: FormGroup;
  submitted = false;
  errorMsg: any;
  imageFiles: File[] = [];
  imagePreviews: string[] = []; // Stores image preview URLs
  selectedDate: string | null = null;
  selectedTime: string | null = null;
  latitude: any;
  longitude: any;
  nocDetails: any;
  encryptedNocId: any;
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
      this.encryptedNocId = navigation.extras.state['encryptedNocId'];
      console.log(this.encryptedNocId, "encryptedNocId");
      console.log(nocData);
    }
    this.trailPitForm = this.fb.group({
      customerActionTypeId: [this.nocDetails.customerActionId, [Validators.required]],
      nocId: [this.nocDetails.nocId, [Validators.required]],
      nocStatus: [this.nocDetails.nocStatusId, [Validators.required]],
      location: [null, [Validators.required]],
      pitDimensions: [null, [Validators.required]],
      soilStraightGraph: [null, [Validators.required]],
      description: [null, [Validators.required]],
      date_time: [null, [Validators.required]],
      inspectionDate: [null, [Validators.required]],
      inspectionTime: [null, [Validators.required]],
      //image: [null, [Validators.required]]
    });
  }

  ngOnInit() {

  }

  get form() { return this.trailPitForm.controls; }
  async captureImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Uri, // Returns a file URI
        source: CameraSource.Camera, // Use CameraSource.Photos for gallery
      });

      if (image.webPath) {
        // Convert image to File format
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const file = new File([blob], `image_${Date.now()}.jpg`, { type: 'image/jpeg' });

        const compressedBlob = await this.nocService.compressImage(image.webPath, 0.6); // Adjust quality
        console.log('compressedBlob', compressedBlob);
        this.nocService.uploadImage(compressedBlob, this.nocDetails.nocId).pipe(finalize(() => {
          this.loaderService.loadingDismiss();
        })).subscribe((res: any) => {
          console.log("Res", res);
          if (res.status == 200 && res.success == true) {
            this.imageFiles.push(res.data);
            this.imagePreviews.push(environment.imgUrl + '' + res.data);
          }
        }, (error: any) => {
          this.loaderService.loadingDismiss();
          this.errorMsg = error;
          this.toastService.showError(this.errorMsg, "Error");
        })
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  }
  deleteImage(index: number) {
    this.imageFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }
  onDateTimeChange(event: any) {
    const fullDateTime = event.detail.value; // Example: "2023-11-02T01:22:00"

    if (fullDateTime) {
      const dateTime = new Date(fullDateTime);

      this.selectedDate = dateTime.toISOString().split('T')[0]; // "2023-11-02"
      this.selectedTime = dateTime.toTimeString().split(' ')[0].substring(0, 8); // "01:22"

      console.log('Selected Date:', this.selectedDate);
      console.log('Selected Time:', this.selectedTime);

      this.trailPitForm.patchValue({
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
    console.log(this.trailPitForm.value);
    await this.loaderService.loadingPresent();
    if (this.trailPitForm.invalid) {
      this.loaderService.loadingDismiss();
      return;
    }
    if (this.imageFiles.length == 0) {
      this.loaderService.loadingDismiss();
      this.toastService.showError('Please upload the images', "Error");
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
    const formData = this.trailPitForm.value;
    // Append form fields to FormData

    // Append location coordinates if available
    if (this.latitude && this.longitude) {
      formData.latitude = this.latitude.toString();
      formData.longitude = this.longitude.toString();
    }
    formData.filePaths = this.imageFiles;
    formData.comments = "";

    this.nocService.saveTrailPit(formData).pipe(finalize(() => {
      this.loaderService.loadingDismiss();
    })).subscribe((res: any) => {
      console.log("Res", res);
      if (res.status == 201 && res.success == true) {
        this.toastService.showSuccess(res.message, "Scccess");
        this.router.navigate(['/trial-pit-details'], { state: { nocData: this.nocDetails, encryptedNocId: this.encryptedNocId } });
      }
      else {
        this.loaderService.loadingDismiss();
        // this.toastr.showError(result.message, "Error");
      }
    }, (error: any) => {
      this.loaderService.loadingDismiss();
      this.errorMsg = error;
      this.toastService.showError(this.errorMsg, "Error");
    })
  }
}

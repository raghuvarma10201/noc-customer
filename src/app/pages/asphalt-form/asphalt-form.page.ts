import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
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
  selector: 'app-asphalt-form',
  standalone: false,
  templateUrl: './asphalt-form.page.html',
  styleUrls: ['./asphalt-form.page.scss'],
})
export class AsphaltFormPage implements OnInit {
  @ViewChild('dateTimeModal') dateTimeModal: any;
  asphaltForm: FormGroup;
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
  minDateTime: any;

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
    private authService: AuthService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const nocData = navigation.extras.state['nocData'];
      const encryptedNocId = navigation.extras.state['encryptedNocId'];
      this.encryptedNocId = encryptedNocId;
      this.nocDetails = nocData;
      console.log(nocData);
    }
    this.minDateTime = new Date().toISOString();
    this.asphaltForm = this.fb.group({
      customerActionTypeId: [this.nocDetails.customerActionId, [Validators.required]],
      nocId: [this.nocDetails.nocId, [Validators.required]],
      nocStatus: [this.nocDetails.nocStatusId, [Validators.required]],
      location: [null, [Validators.required]],
      totalAreaToCutInSquareMeters: [null, [Validators.required]],
      roadCutLengthInMeters: [null, [Validators.required]],
      roadCutWidthInMeters: [null, [Validators.required]],
      isTrafficAffected: [null, [Validators.required]],
      description: [null, [Validators.required]],
      date_time: [null, [Validators.required]],
      inspectionDate: [null, [Validators.required]],
      inspectionTime: [null, [Validators.required]]
    });
  }

  ngOnInit() {

  }

  get form() { return this.asphaltForm.controls; }
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
          if (res.status == 201 && res.success == true) {
            this.imageFiles.push(res.data);
            this.imagePreviews.push(environment.imgUrl + '' + res.data);
            console.log('image preview', this.imagePreviews);
          }
        }, error => {
          this.loaderService.loadingDismiss();
          this.errorMsg = error;
          this.toastService.showError('Something went wrong', "Error");
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
      this.asphaltForm.patchValue({
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
    console.log(this.asphaltForm.value);
    await this.loaderService.loadingPresent();
    if (this.asphaltForm.invalid) {
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
    const formData = this.asphaltForm.value;

    // Append form fields to FormData
    if (formData.isTrafficAffected === 'true') {
      formData.isTrafficAffected = true;
    } else {
      formData.isTrafficAffected = false;
    }

    // Append location coordinates if available
    if (this.latitude && this.longitude) {
      formData.latitude = this.latitude.toString();
      formData.longitude = this.longitude.toString();
    }
    formData.filePaths = this.imageFiles;
    formData.comments = "";
    this.nocService.saveAsphaltForm(formData).pipe(finalize(() => {
      this.loaderService.loadingDismiss();
    })).subscribe((res: any) => {
      console.log("Res", res);
      if (res.status == 201 && res.success == true) {
        this.asphaltForm.reset();
        this.imageFiles = [];
        this.imagePreviews = [];
        this.toastService.showSuccess('', "Scccess");
        this.router.navigate(['/asphalt-details'], { state: { nocData: this.nocDetails, encryptedNocId: this.encryptedNocId } });
      }
      else {
        this.loaderService.loadingDismiss();
      }
    }, (error: any) => {
      this.loaderService.loadingDismiss();
      this.errorMsg = error;
      this.toastService.showError( 'Something went wrong', "Error");
    })
  }

  openDateTimePicker() {
    this.dateTimeModal.present();
  }

  logout() {
    this.authService.logout();
  }
}

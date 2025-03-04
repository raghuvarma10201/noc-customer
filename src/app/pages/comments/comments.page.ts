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
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  standalone: false,
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {

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
  customerActionId: any;
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
      console.log(this.nocDetails, "nocDetails");
      const encryptedNocId = navigation.extras.state['encryptedNocId'];
      this.encryptedNocId = encryptedNocId;
      const customerActionId = navigation.extras.state['customerActionId'];
      this.customerActionId = customerActionId;
      console.log(nocData);
    }
    this.trailPitForm = this.fb.group({
      customerActionId: [this.customerActionId, [Validators.required]],
      nocId: [this.encryptedNocId, [Validators.required]],
      comments: [null, [Validators.required]],
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
        const compressedBlob = await this.nocService.compressImage(image.webPath, 0.6);
        this.nocService.uploadImage(compressedBlob, this.nocDetails.nocId).pipe(finalize(() => {
          this.loaderService.loadingDismiss();
        })).subscribe((res: any) => {
          console.log("Res", res);
          if (res.status == 200 && res.success == true) {
            this.imageFiles.push(res.data);
            this.imagePreviews.push(environment.imgUrl + '' + res.data);
          }
        }, error => {
          this.loaderService.loadingDismiss();
          this.errorMsg = error;
          this.toastService.showError(this.errorMsg, "Error");
        })
      }
        // this.imageFiles.push(file);
        // this.imagePreviews.push(image.webPath);
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
    // if (this.imageFiles.length == 0) {
    //   this.loaderService.loadingDismiss();
    //   this.toastService.showError('Please upload the images', "Error");
    //   return;
    // }
    const location = await this.geolocationService.getCurrentLocation();
    if (location) {
      this.latitude = location.latitude;
      this.longitude = location.longitude;
      console.log('Current position:', this.latitude, this.longitude);
    } else {
      console.warn('Could not retrieve location');
    }
    const formValue = this.trailPitForm.value;

    const formData = new FormData();
    this.imageFiles.forEach((file, index) => {
      formData.append(`uploadFile`, file, file.name);
    });
    // Append form fields to FormData

    // Append location coordinates if available
    if (this.latitude && this.longitude) {
      formData.append(`latitude`, this.latitude.toString());
      formData.append(`longitude`, this.longitude.toString());
    }
    formData.append(`customerActionId`, formValue.customerActionId);
    formData.append(`nocId`, formValue.nocId);
    formData.append(`comments`, formValue.comments);

    let payload = {
      uploadFile: this.imageFiles,
      latitude: this.latitude,
      longitude: this.longitude,
      customerActionId: formValue.customerActionId,
      nocId: formValue.nocId,
      comments: formValue.comments,
      trailPitOrRoadCuttingId: this.nocDetails.trailPitId
    }
    
    console.log("payload", payload);
    this.nocService.addComments(payload).pipe(finalize(() => {
      this.loaderService.loadingDismiss();
    })).subscribe((res: any) => {
      console.log("Res", res);
      if (res.status == 201 && res.success == true) {
        this.trailPitForm.reset();
        this.imageFiles = [];
        this.toastService.showSuccess(res.message, "Scccess");
        if(this.customerActionId == 2){
          this.router.navigate(['/trial-pit-details'], { state: { nocData: this.nocDetails,encryptedNocId : this.encryptedNocId } });
        }else{
          this.router.navigate(['/asphalt-details'], { state: { nocData: this.nocDetails,encryptedNocId : this.encryptedNocId } });
        }
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

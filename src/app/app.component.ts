import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { LoaderService } from './services/loader.service';
import { NocService } from './services/noc.service';
import { SharedService } from './services/shared.service';
import { ToastService } from './services/toast.service';
import { CommonService } from './services/common.service';
import { Platform, AlertController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { Camera } from '@capacitor/camera';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Capacitor } from "@capacitor/core";
import { TranslationService } from './services/translation.service';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  deviceInfo: any;
  errorMsg: any;
  imagesLimit: any;

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
    public router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService,
    private commonService: CommonService,
    private nocService: NocService,
    private route: ActivatedRoute,
    private platform: Platform,
    private alertController: AlertController,
    private diagnostic: Diagnostic,
    private translationService: TranslationService
  ) {
    this.translationService.loadTranslationsFromAPI(localStorage.getItem('language') || 1); // Load English translations
  }

  switchLanguage(lang: string) {
    localStorage.setItem('language', lang);
    this.translate.use(lang);
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.getDeviceInfo();
      this.getDefaultSettings();
      const savedLang = localStorage.getItem('language');
      if (savedLang) {
        //this.translate.use(savedLang);
      }
      this.checkAndRequestPermissions();
    });
    console.log('Initializing HomePage');
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  async getDeviceInfo() {
    this.deviceInfo = await Device.getInfo();
    console.log('Device Info:', this.deviceInfo);
  }

  getDefaultSettings() {
    this.commonService.getDefaultSettings().pipe(finalize(() => {
      console.log('api completed');
    })).subscribe((res: any) => {
      console.log("Res", res);
      if (res.status == 200 && res.success == true) {
        localStorage.setItem('defaultSettings', JSON.stringify(res.data));
        const imagesSetting = res.data.find((item: any) => item.configKey === 'limitForUploadPictures');
        this.imagesLimit = Number(imagesSetting.configValue);
        localStorage.setItem('imagesLimit', this.imagesLimit);
      }
      else {
        this.toastService.showError(res.message, "Error");
      }
    }, error => {
      this.errorMsg = error;
      console.log('Something went wrong', "getDefaultSettings Error");
    })
  }

  async checkAndRequestPermissions() {
    try {
      if (Capacitor.getPlatform() === 'android') {
        // Check location permission
        const locationPerm = await Geolocation.checkPermissions();

        // Check camera permission
        const cameraPerm = await Camera.checkPermissions();

        // If either permission is not granted, show persistent alert
        if (locationPerm.coarseLocation !== 'granted' || cameraPerm.camera !== 'granted') {
          Geolocation.requestPermissions();
          Camera.requestPermissions();
        }
      }
    } catch (error) {
      // Check location permission
      if (Capacitor.getPlatform() === 'android') {
        const locationPerm = await Geolocation.checkPermissions();

        // Check camera permission
        const cameraPerm = await Camera.checkPermissions();
        await this.showPermissionAlert(locationPerm.coarseLocation, cameraPerm.camera);
        console.error('Permission check failed:', error);
        this.toastService.showError('Failed to check permissions', 'Error');
      }
    }


  }

  async showPermissionAlert(locationStatus: string, cameraStatus: string) {
    const alert = await this.alertController.create({
      header: 'Permissions Required',
      message: this.generatePermissionMessage(locationStatus, cameraStatus),
      buttons: [
        {
          text: 'Open Settings',
          handler: () => {
            // Open app settings using Diagnostic
            this.diagnostic.switchToSettings();

            // Recursively check permissions after attempting to open settings

            // Prevent alert from closing
            return false;
          }
        }
      ],
      backdropDismiss: false // Prevent dismissing the alert by tapping outside
    });

    await alert.present();
  }

  generatePermissionMessage(locationStatus: string, cameraStatus: string): string {
    const messages: string[] = [];

    if (locationStatus !== 'granted') {
      messages.push('Location permission is required for the app to function correctly.');
    }

    if (cameraStatus !== 'granted') {
      messages.push('Camera permission is required for taking photos.');
    }

    return messages.join('\n\n') + '\n\nPlease go to app settings and grant the necessary permissions.';
  }

}
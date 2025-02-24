import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class IonLoaderService {
  constructor(public loadingController: LoadingController) {}

  // Show loader
  async showLoader() {
    await this.loadingController
      .create({
        message: 'Loading...',
        showBackdrop: true,
        spinner: 'lines',
      })
      .then((response) => {
        response.present();
      });
  }

  // Dismiss loader
  async dismissLoader() {
    return await this.loadingController
      .dismiss()
      .then((response) => {
        console.log('Loader closed!', response);
      })
      .catch((err) => {
        console.log('Error occured : ', err);
      });
  }
}

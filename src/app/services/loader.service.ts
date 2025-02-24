import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading: boolean=false;

  constructor(public loadingController: LoadingController) { }

  
  async loadingPresent() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        message: 'Please wait ...',
        spinner: 'crescent',
        cssClass: 'loaderbg',
      })
      .then((a) => {
        a.present().then(() => {
          console.log('loading presented');
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort laoding'));
          }
        });
      });
  }
  async loadingPresentcm(message: any) {
    this.isLoading = true;
    return await this.loadingController
      .create({
        message: message,
        spinner: 'crescent',
        cssClass: 'loaderbg',
      })
      .then((a) => {
        a.present().then(() => {
          console.log('loading presented');
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort laoding'));
          }
        });
      });
  }

  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => console.log('loading dismissed'));
  }
}

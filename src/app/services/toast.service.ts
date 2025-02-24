import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  pageTitle: any;
  constructor(
    public toastController: ToastController,
    private activatedRouterServices: ActivatedRoute
  ) { }

  async showSuccess(message: any, title: any) {
    const toast = await this.toastController.create({
      header: title,
      // eslint-disable-next-line object-shorthand
      message: message,
      position: 'top',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async showError(message: any, title: any) {
    const toast = await this.toastController.create({
      header: title,
      // eslint-disable-next-line object-shorthand
      message: message,
      position: 'top',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }

  async showInfo(message: any, title: any) {
    const toast = await this.toastController.create({
      header: title,
      // eslint-disable-next-line object-shorthand
      message: message,
      position: 'top',
      duration: 2000,
      color: 'tertiary'
    });
    toast.present();
  }

  async showWarning(message: any, title: any) {
    const toast = await this.toastController.create({
      header: title,
      // eslint-disable-next-line object-shorthand
      message: message,
      position: 'top',
      duration: 2000,
      color: 'warning'
    });
    toast.present();
  }



}

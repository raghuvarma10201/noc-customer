import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public menuClosed = new BehaviorSubject(true); // set whatever default value;
  public posts = new Subject();
  public isUserLogin = new Subject();
  public isThitUserLogin = new Subject();
  public getYear = new Subject();
  public senderProfile = new Subject();
  public conferenceDetails = new Subject();
  public workshopCheckedDetails = new Subject();
  private data: any=''
  constructor() { 
    // console.log("confe Details", this.conferenceDetails);
    // this.setConferenceData({});

  }

 updateMenuState(state: boolean) {
   this.menuClosed.next(state)
 };

 setMenuType(menu:any){
  console.log("Menu Type", menu);
   this.posts.next({menuType:menu});
 }
 setConferenceData(data:any){
  console.log("confe Details",data);
  this.conferenceDetails.next(data);
 }
//  setCheckedData(data: any){
//   console.log("wsregDetails -->", data);
//   this.workshopCheckedDetails.next(data);
//  }

sendData(data: any): void {
  this.data = data;
}

getData(): any {
  return this.data;
}

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { register } from 'swiper/element/bundle';
import {jwtDecode} from 'jwt-decode';
register();
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  standalone: false,
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  dashboardCounts: any;
  username: any;

  constructor(
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getNameIdentifier();
    this.getDashboardCounts();
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getDashboardCounts(){
    this.commonService.getDadhboardCounts().subscribe((res: any) => {
      this.dashboardCounts = res.data;
      console.log('dashboard counts', this.dashboardCounts);
    }, error => {
      console.log("Error", error);
    })
  }

  navigateToNocList(userType: string){
    this.router.navigate(['/list-noc', { userType: userType }]);
  }

  getNameIdentifier(): any {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    try {
      const decodedToken: any = jwtDecode(token);
      this.username = decodedToken?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
      console.log("username", this.username);
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  }

}

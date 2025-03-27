import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { register } from 'swiper/element/bundle';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

register();

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {
  dashboardCounts = new BehaviorSubject<any>(null); // Reactive state management
  username: string | null = null;

  constructor(
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    // this.loadDashboardData();
  }

  ionViewWillEnter(){
    this.loadDashboardData();
  }

  async loadDashboardData() {
    this.getNameIdentifier();
    await this.getDashboardCounts();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  async getDashboardCounts() {
    try {
      const res = await this.commonService.getDadhboardCounts().toPromise();
      this.dashboardCounts.next(res.data);
      console.log('Dashboard counts:', res.data);
    } catch (error) {
      console.error('Error fetching dashboard counts:', error);
    }
  }

  navigateToNocList(userType: string) {
    this.router.navigate(['/list-noc', { userType }]);
  }

  getNameIdentifier() {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    
    try {
      const decodedToken: any = jwtDecode(token);
      this.username =
        decodedToken?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null;
      console.log("Username:", this.username);
    } catch (error) {
      console.error("Invalid token", error);
      this.username = null;
    }
  }

  doRefresh(event: any) {
    console.log("Refreshing data...");

    setTimeout(() => {
      this.loadDashboardData();
      event.target.complete();
      console.log("Refresh complete");
    }, 2000);
  }
}

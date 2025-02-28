import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { register } from 'swiper/element/bundle';
register();
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  standalone: false,
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  dashboardCounts: any;

  constructor(
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
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

}

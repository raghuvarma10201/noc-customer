import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
register();
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  standalone: false,
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

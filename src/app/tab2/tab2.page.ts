import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiMainService } from '../services/api-main-service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {

  user: any = {};
  isDarkMode = false;

  constructor(
    private apiService: ApiMainService,
    private router: Router,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.loadProfile();
    this.isDarkMode = this.themeService.isDark();
  }

  toggleTheme(event: any) {
    this.themeService.setTheme(event.detail.checked);
    this.isDarkMode = event.detail.checked;
  }

  loadProfile() {
    const session = localStorage.getItem('user_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        this.user = parsed.pickupboy || {};
      } catch (e) {
        console.error('Error parsing user session', e);
      }
    }
  }

  logout() {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }

}

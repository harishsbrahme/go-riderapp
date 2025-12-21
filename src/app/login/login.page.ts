import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiMainService } from '../services/api-main-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  userName = '';
  password = '';

  constructor(
    private router: Router,
    public apiService: ApiMainService
  ) { }

  ngOnInit() { }

  login() {
    if (!this.userName || !this.password) {
      return;
    }

    this.apiService.dpLogin(this.userName, this.password).subscribe({
      next: (res: any) => {
        console.log('Login Success:', res);
        this.router.navigate(['/tabs']);
      },
      error: (err: any) => {
        console.error('Login Error:', err);
      }
    });
  }
}

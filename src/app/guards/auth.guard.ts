import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { ApiMainService } from '../services/api-main-service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanLoad {

    constructor(private authService: ApiMainService, private router: Router) { }

    canLoad(): boolean {
        if (this.authService.isAuthenticated()) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}

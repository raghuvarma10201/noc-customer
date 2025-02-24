import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './../services/auth.service';  // A service that manages authentication (needs to be created)
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated().pipe(
      map((isAuthenticated: boolean) => {
        if (isAuthenticated) {
        
          //this.router.navigate(['/dashboard']);
          return true;
        } else {
          // If user is not authenticated, navigate to login page
          this.router.navigate(['/login']);
          return false;
        }
        
      })
    );
  }
}

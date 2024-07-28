import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = this.authService.getToken();
    
    if (token) {
      const roles = route.data['roles'] as Array<string>;
      
      if (roles && roles.length > 0) {
        const match = this.authService.roleMatch(roles);
        
        if (match) {
          return true; // Allow access to the route
        } else {
          this.router.navigate(['/forbidden']); // Navigate to forbidden page if roles don't match
          return false;
        }
      }
      
      return true; // No roles specified or no role validation required
    }
    
    // Redirect to login page or handle unauthorized access
    this.router.navigate(['/sign-in']);
    return false;
  }
}

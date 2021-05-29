import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ViewSummaryService } from '../_services/viewsummary.service';

@Injectable({
  providedIn: 'root'
})
export class ViewSummaryGuard implements CanActivate{

  constructor(private service: ViewSummaryService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.service.businessDefaults != null && this.service.projectSettings != null && this.service.zones != null
      && this.service.workAreas != null) {
      return true;
    }
    this.router.navigateByUrl('viewExistingProjects');
    return false;
  }
}

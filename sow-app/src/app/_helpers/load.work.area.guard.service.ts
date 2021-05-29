import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { AppService } from '../_services';
import { FormService } from '../_services/form.service';
import { ZonesManager } from './zone';

@Injectable({
  providedIn: 'root'
})
export class LoadWorkAreaGuard {
  zonesManager: ZonesManager;
  constructor(private router: Router, private formService: FormService) {
     this.zonesManager = new ZonesManager(null,formService.zones);
   }

  // User can go from zones to work area page if the zones list is not null and is valid
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.formService.zones != null && this.zonesManager.isZonesValid) {
      return true;
    }
    
    this.router.navigateByUrl("/zones");
    return false;
  }
}

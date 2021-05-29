import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { AppService } from '../_services';
import { FormService } from '../_services/form.service';

@Injectable({ providedIn: 'root' })
export class ZoneGuard implements CanActivate {
  constructor(private router: Router, private formService: FormService,
    private storage: LocalStorageService) { }

  // Prevents the user from loading into the zone if it doesn't exist
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.formService.zones != null
      || this.storage.retrieve('zones') != null) {
      return true;
    }

    this.router.navigateByUrl("/home");
    return false;
  }
}
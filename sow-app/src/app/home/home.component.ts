import { Component, OnInit } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { AppService } from '../_services/app.service';
import { FormService } from '../_services/form.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private storage: LocalStorageService, private formService: FormService) { }

  /**
   * Will clear out the session storage
   */
  clearStorage() {
    /*this.storage.clear('project');
    this.storage.clear('businessDefaults');
    this.storage.clear('projectSettings');
    this.storage.clear('zones');
    this.storage.clear('workAreas');
    this.formService.projectName = null;
    this.formService.businessDefaults = null;
    this.formService.projectSettings = null;
    this.formService.zones = null;
    this.formService.workAreas = null;*/
  }

  ngOnInit(): void {
  }

}

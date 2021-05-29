import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Collapse } from 'bootstrap';
import { LocalStorageService } from 'ngx-webstorage';
import { HandleForms } from '../_helpers/handle-forms';
import { HandleWorkArea } from '../_helpers/handle-work-area';
import { HandleZones } from '../_helpers/handle-zones';
import { BusinessDefaults, ProjectSettings, WorkArea, Zone } from '../_models/form';
import { AppService } from '../_services';
import { FormService } from '../_services/form.service';
import { convertImgToBase64URL } from './base64';
import { PDFGenerator } from './pdfgenerator';

@Component({
  selector: 'app-form',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  // The objects converted to raw value from their form controls
  businessDefaults: BusinessDefaults;
  projectSettings: ProjectSettings;
  workAreas: WorkArea[];
  zones: Zone[];

  imgData: any

  constructor(private formService: FormService, public appService: AppService) { }



  pdfGenerate(isClient?: boolean) {
    let generator = new PDFGenerator();
    
    if (isClient) {
      generator.generateClientReport(this.projectSettings,
        this.zones, this.workAreas, this.imgData);
    } else {
      generator.generateBusinessReport(this.businessDefaults,
        this.projectSettings,
        this.zones, this.workAreas, this.imgData);
    }
  }

  ngOnInit(): void {

    convertImgToBase64URL('assets/yourqs.png', (base64Img: any) => {
      this.imgData = base64Img
    });

    this.businessDefaults = this.formService.businessDefaults.value;
    this.projectSettings = this.formService.projectSettings.value;
    this.workAreas = this.formService.workAreas.value;
    this.zones = this.formService.zones.value;
  }

}

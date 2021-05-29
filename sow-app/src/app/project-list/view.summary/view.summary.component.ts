import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { convertImgToBase64URL } from 'src/app/summary/base64';
import { PDFGenerator } from 'src/app/summary/pdfgenerator';
import { HandleForms } from 'src/app/_helpers/handle-forms';
import { HandleWorkArea } from 'src/app/_helpers/handle-work-area';
import { HandleZones } from 'src/app/_helpers/handle-zones';
import { BusinessDefaults, ProjectSettings, WorkArea, Zone } from 'src/app/_models/form';
import { Project } from 'src/app/_models/project';
import { AppService } from 'src/app/_services';
import { ViewSummaryService } from 'src/app/_services/viewsummary.service';

@Component({
  selector: 'app-view-summary',
  templateUrl: './view.summary.component.html',
  styleUrls: ['./view.summary.component.scss']
})
export class ViewSummaryComponent implements OnInit {

  project: Project;
  businessDefaults: BusinessDefaults;
  projectSettings: ProjectSettings;
  workAreas: WorkArea[];
  zones: Zone[];

  imgData: any

  constructor(private service: ViewSummaryService) { }



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

    this.project = this.service.project;
    this.businessDefaults = this.service.businessDefaults;
    this.projectSettings = this.service.projectSettings;
    this.zones = this.service.zones;
    this.workAreas = this.service.workAreas;
    convertImgToBase64URL('assets/yourqs.png', (base64Img: any) => {
      this.imgData = base64Img
    });
  }

}

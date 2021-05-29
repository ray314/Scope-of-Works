import { Component, NgModule, OnInit } from '@angular/core';
import { AppService } from '../_services'
import { HttpClient } from '@angular/common/http';
import { PDFGenerator } from '../summary/pdfgenerator';
import { convertImgToBase64URL } from '../summary/base64';
import { BusinessDefaults, ProjectSettings, WorkArea, Zone } from '../_models/form';
import { HandleForms } from '../_helpers/handle-forms';
import { HandleZones } from '../_helpers/handle-zones';
import { HandleWorkArea } from '../_helpers/handle-work-area';
import { Router } from '@angular/router';
import { ViewSummaryService } from '../_services/viewsummary.service';
import { FormService } from '../_services/form.service';
import { Project } from '../_models/project';



@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  projects: Project[];
  imgData: any;

  businessDefaults: BusinessDefaults = null;
  projectSettings: ProjectSettings;
  zones: Zone[];
  workAreas: WorkArea[];

  constructor(public formService: FormService, public appService: AppService, private router: Router, private viewSummaryService: ViewSummaryService) { }

  viewSummary(id: number) {
    
    let project = this.projects[id];
    console.log(project);
    this.viewSummaryService.project = project;
    this.viewSummaryService.businessDefaults = project.businessDefaults;
    this.viewSummaryService.projectSettings = project.projectSettings;
    this.viewSummaryService.zones = project.zones;
    this.viewSummaryService.workAreas = project.workAreas;
    this.router.navigateByUrl("/view-summary");
  }

  /**
   * Converts a JSON String to a Object
   * @param projects A JSON String
   */
  private toObject(projects: any) {
    for (let i = 0; i < projects.length; i++) {
      //console.log(project);
      projects[i] = JSON.parse(projects[i]);
    }
  }


  ngOnInit(): void {
    convertImgToBase64URL('assets/yourqs.png', (base64Img: any) => {
      this.imgData = base64Img;
    });
    this.appService.getAllProjects((callback) => {
      
      this.projects = callback
      this.toObject(this.projects)
      //console.log(this.hz.convert2FormArray(zones));
      //console.log(this.hwa.mapWorkAreas(workAreas));
    });

    //
  }

}

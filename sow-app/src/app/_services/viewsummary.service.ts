import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BusinessDefaults, ProjectSettings, WorkArea, Zone } from '../_models/form';
import { Project } from '../_models/project';

@Injectable({
  providedIn: 'root'
})
export class ViewSummaryService {

  project: Project;
  businessDefaults: BusinessDefaults;
  projectSettings: ProjectSettings;
  workAreas: WorkArea[];
  zones: Zone[];
  
  constructor() { }
}

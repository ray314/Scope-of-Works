import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from "../_models/project";
import { FormService } from "./form.service";

@Injectable()
/**
 * The service to manage project submissions to server
 */
export class AppService{
	public projects: any; // 

	rootUrl = '/api';
	destroy$: Subject<boolean> = new Subject<boolean>();


	constructor(private http: HttpClient, private router: Router,
		private storage: LocalStorageService, private formService: FormService) {

	}

	/**
	 * Called when form is submitted
	 */
	onSubmit() {
		// Nest all the form groups together
		let projectForm = new FormGroup({
			id: new FormControl(),
			projectName: this.formService.projectName,
			businessDefaults: this.formService.businessDefaults,
			projectSettings: this.formService.projectSettings,
			zones: this.formService.zones,
			workAreas: this.formService.workAreas
		});
		// Get the value of the project form
		let formObj: Project = projectForm.getRawValue();
		
		// Send the form to server
		this.addProject(formObj)
			.pipe(takeUntil(this.destroy$)).subscribe(response => {
				console.log('message received from server: ', response)
				if (response == "Success") {
					// Navigate to success component
					this.router.navigateByUrl("/success");
					// Clear all the data in the forms
					this.formService.zones = new FormArray([]) // For storing zones into an array
					this.formService.workAreas = new FormArray([])
					this.formService.businessDefaults = null
					this.formService.projectSettings = null
					this.formService.projectName = null
          // Clear project from local storage
          this.storage.clear('zones')
          this.storage.clear('workAreas')
          this.storage.clear('projectSettings')
          this.storage.clear('businessDefaults')
          this.storage.clear('project')
				} else {
					// Output an error if there was an error submitting
					alert("There was an error submitting your project: " + response);
				}
			});

	}

	/**
	 * Returns all projects from the server
	 */
	getAllProjects(callback: any): any {
		this.getProjects().pipe(takeUntil(this.destroy$))
			.subscribe((projects: any[]) => {
				this.projects = projects
				callback(projects)
			})
	}
	saveProjects(data: any) {
		return this.http.post(this.rootUrl + "/updateproject", { data })
	}
	/**
	 * Sends the project to the server
	 * @param data The project data in JSON
	 */
	addProject(data: any) {
		return this.http.post(this.rootUrl + "/addproject", { data });
	}

	/**
	 * Requests the project from the server
	 */
	getProjects(): any {
		return this.http.get(this.rootUrl + "/projects");
	}

	

	// Clean up when Angular closes
	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}	

}
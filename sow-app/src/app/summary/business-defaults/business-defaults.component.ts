import { Component, Input, NgModule, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { HandleForms } from 'src/app/_helpers/handle-forms';
import { AppService } from 'src/app/_services/app.service';
import { FormService } from 'src/app/_services/form.service';

@Component({
	selector: 'app-business-defaults',
	templateUrl: './business-defaults.component.html',
	styleUrls: ['./business-defaults.component.scss']
})
export class BusinessDefaultsComponent implements OnInit {
	project: FormGroup;
	projectName: FormControl;
	businessDefaults: FormGroup;

	get companyName() { return this.businessDefaults.get('companyName'); }
	get yourName() { return this.businessDefaults.get('yourName'); }

	constructor(private formService: FormService,
		 private fb: FormBuilder, private router: Router) {

	}

	/**
	 * Check if all required fields are completed
	 */
	onSubmit() {
		if (this.businessDefaults.valid) {
			// Navigate to project settings page
			this.router.navigateByUrl("/projectSettings");
		} else {
			// Mark all controls as touched so that validation errors pop up
			this.businessDefaults.markAllAsTouched();
		}
	}

	updateName(event: any) {
		this.projectName.setValue(event.target.value);
		//console.log(this.formService.projectName.value);
	}

	ngOnInit(): void {
		this.projectName = this.formService.projectName;
		this.project = this.fb.group({name: this.projectName});
		this.businessDefaults = this.formService.businessDefaults;
		/*let businessDefaultsData = this.storage.retrieve('businessDefaultsForm');
		// The service saves the form so if it is already defined, it is used instead of creating a new one
		if (this.appService.businessDefaultsForm != null) {
			this.businessDefaults = this.appService.businessDefaultsForm;
		} else if (businessDefaultsData != null) {
			this.setBusinessDefaults(businessDefaultsData);
			this.appService.businessDefaultsForm = this.businessDefaults;
		} else {
			this.setBusinessDefaults();
			this.appService.businessDefaultsForm = this.businessDefaults;
		}
		// Subscribe to form changes
		this.appService.businessDefaultsForm$ = this.businessDefaults.valueChanges.subscribe(data => {
			// Clear and store when changes are detected
			this.storage.clear('businessDefaultsForm');
			this.storage.store('businessDefaultsForm', data);
		});*/

	}

}

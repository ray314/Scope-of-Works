import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { HandleForms } from 'src/app/_helpers/handle-forms';
import { AppService } from 'src/app/_services';
import { FormService } from 'src/app/_services/form.service';

@Component({
	selector: 'app-project-settings',
	templateUrl: './project-settings.component.html',
	styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent {

	projectSettings: FormGroup;


	// Use get methods to allow for easier access to the form control
	get address() { return this.projectSettings.get('address') }
	get livingArrange() { return this.projectSettings.get('siteArrangement').get('livingArrange') }
	get seasprayzone() { return this.projectSettings.get('siteArrangement').get('seasprayzone') }

	constructor(private formService: FormService, private fb: FormBuilder, private router: Router,
		private storage: LocalStorageService, private hf: HandleForms) { }

	

	/**
	 * Check if all required fields are completed
	 */
	onSubmit() {
		if (this.projectSettings.valid) {
			// Navigate to zones page
			this.router.navigateByUrl("/zones");
		} else {
			// Mark all controls as touched so that validation errors pop up
			this.projectSettings.markAllAsTouched();
		}
	}

	ngOnInit(): void {
		this.projectSettings = this.formService.projectSettings;

		//let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
		/*let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new Tooltip(tooltipTriggerEl, { container: 'body' })
		});*/
		
		//var toolTip = new Tooltip(this.tooltip.nativeElement);
	}
}


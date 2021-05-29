import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstorage';
import { merge, Subscription } from 'rxjs';
import { HandleForms } from '../_helpers/handle-forms';
import { HandleWorkArea } from '../_helpers/handle-work-area';
import { HandleZones } from '../_helpers/handle-zones';
import { ZonesManager } from '../_helpers/zone';
import { Project } from '../_models/project';

@Injectable({
  providedIn: 'root'
})
export class FormService implements OnInit, OnDestroy {
  public projectName: FormControl; // The name of the current project
	public projectName$: Subscription;
	public workAreas: FormArray
	public workAreas$: Subscription; // To subscribe to changes in the form
	public zones: FormArray; // For storing zones into an array
	public zones$: Subscription;
	public businessDefaults: FormGroup;
	public businessDefaults$: Subscription;
	public projectSettings: FormGroup;
	public projectSettings$: Subscription;

	private zonesManager: ZonesManager;

  constructor(private fb: FormBuilder, private storage: LocalStorageService, private hf: HandleForms,
		private hz: HandleZones, private hwa: HandleWorkArea) { }

	// Sets up the business defaults form
  private setBusinessDefaults(data?: any) {
		// Use default values if data is not passed
		if (data == null) {
			this.businessDefaults = this.fb.group({
				companyName: [
					'',
					[Validators.required,
					Validators.minLength(4)]],
				yourName: [
					'',
					[Validators.required,
					Validators.minLength(4)]],
				// People and pricing
				peoplePricing: this.fb.group({
					markup: [''],
					adminHours: [''],
					supervisionHours: [''],
					projectMHours: [''],
					buildingTeamHours: [''],
					// CPH - cost per hour
					adminCPH: [''],
					supervisionCPH: [''],
					// M - Management
					projectMCPH: [''],
					// T - Team
					buildingTCPH: [''],
					// Rates are:
					ratesAre: ['']
				}),
				// Site Sign
				siteSign: [''],
				// Sub Trades
				subTrades: this.fb.group({
					plasterboardLabourBy: [''],
					plasterboardCeilingDefault: [''],
					insulation: [''],
					ceilingBattens: ['']
				}),
				// Job rates
				jobRates: this.fb.group({
					plumber: [''],
					electrician: [''],
					painter: [''],
					drainlayer: [''],
					roofer: ['']
				})
			});
		} else {
			// Convert storage data to FormGroup
			this.businessDefaults = this.hf.loadBusinessDefaults(data);
		}
	}

	private setProjectSettings(data?: any) {
		if (data == null) {
			this.projectSettings = this.fb.group({
				address: ['',
					[Validators.required,
					Validators.minLength(10)]],
				client: [''],
				projectDescription: [''],

				peoplePricing: this.fb.group({
					nCarpenters: [''],
					eProjectDuration: [''], // Estimated project duration
					bContingency: [''], // Builders contingency
					dContingency: [''], // Drainage contingency
					pContingency: [''], // Plumbing contingency
					eContingency: [''], // Electrical contingency
					cContingency: [''] // Client contingency allowance
				}),

				siteArrangement: this.fb.group({
					siteAccess: [''], // Site Access
					spaceStorage: [''], // Space for material storage
					scaffoldAComment: [''], // Scaffold access comment
					sWrapping: [''], // Scaffold Wrapping
					livingArrange: ['',
						[Validators.required]], // Living Arrangements
					addHours: [''], // Allow additonal hours due to site
					seasprayzone: ['',
						[Validators.required]]  // Is Sea Spray Zone?
				}),

				safetyRequirements: this.fb.group({
					siteSecurityFencing: [''], // Site Security Fencing
					fallInProtection: [''], // Fall In Protection
					toiletHireRequired: [''], // Toilet Hire Required
					vehicleCrossingProtect: [''] // Vehicle Crossing Protection
				}),

				allowancesInsurances: this.fb.group({
					contractorsRiskFee: [''],
					buildingGuaranteeFee: ['']
				}),

				professionalServices: this.fb.group({
					drawings: [''],
					geotechnical: [''],
					engineering: [''],
					landSurveyor: [''],
					councilFees: [''],
					other: [''],
					comment: ['']
				}),

				interior: this.fb.group({
					material: this.fb.group({
						doors: [''],
						skirting: [''],
						scotia: [''], // Scotia/Cornice
						architrave: ['']
					}),

					style: this.fb.group({
						doors: [''],
						skirting: [''],
						scotia: [''], // Scotia/Cornice
						architrave: ['']
					})
				}),

				exterior: this.fb.group({
					material: this.fb.group({
						primaryCladding: [''],
						secondaryCladding: [''],
						joineryType: [''],
						roof: ['']
					}),

					type: this.fb.group({
						primaryCladding: [''],
						secondaryCladding: [''],
						joineryType: [''],
						roof: ['']
					})
				}),

				otherComments: ['']
			});
		} else {
			// Map the stored data to the form group if the data is supplied
			this.projectSettings = this.hf.loadProjectSettings(data);
		}
		this.projectSettings.controls['siteArrangement'].get('livingArrange').setValidators(Validators.required);
		this.projectSettings.controls['siteArrangement'].get('seasprayzone').setValidators(Validators.required);
	}
	// Subscribe to the valueChanged observables so that we can save to storage each time it gets updated
  subscriptionInit() {

    this.projectName$ = this.projectName.valueChanges.subscribe(data => {
			this.storage.clear('projectName');
			this.storage.store('projectName', data);
		});
		
		this.businessDefaults$ = this.businessDefaults.valueChanges.subscribe(data => {
			this.storage.clear('businessDefaults');
			this.storage.store('businessDefaults', data);
		});

		this.projectSettings$ = this.projectSettings.valueChanges.subscribe(data => {
			this.storage.clear('projectSettings');
			this.storage.store('projectSettings', data);
		});

		this.zones.controls.forEach((control: FormGroup) => {
			merge(
				control.get('name').valueChanges,
				control.get('description').valueChanges,
				control.get('trades').valueChanges,
				control.get('workArea').valueChanges
			).subscribe((data) => {
				this.storage.clear('zones');
				this.storage.store('zones', this.zones.getRawValue()); // Use this.zones since it doens't emit the whole array
			});
			
		});

		/*this.zones$ = this.zones.valueChanges.subscribe(data => {
			
			//console.log(data);
		});*/
		
		// Work Area
		this.workAreas$ = this.workAreas.valueChanges.subscribe(data => {
			this.storage.clear('workAreas'); // Clear previous data
			this.storage.store('workAreas', data);
			//console.log(data);
		});
  }
  ngOnInit(): void {
		// Initialise all the forms
    let projectNameLS = this.storage.retrieve('projectName');
		let businessDefaultsLS = this.storage.retrieve('businessDefaults');
		let projectSettingsLS = this.storage.retrieve('projectSettings');
		let workAreasLS = this.storage.retrieve('workAreas');
    let zonesLS = this.storage.retrieve('zones');
		// If data exists on the local storage, map the data to Form objects
		if (projectNameLS != null) {
			this.projectName = new FormControl(projectNameLS);
		} else {
			this.projectName = new FormControl();
		}
		if (businessDefaultsLS != null) {
			this.setBusinessDefaults(businessDefaultsLS);
		} else {
			this.setBusinessDefaults();
		}
		if (projectSettingsLS != null) {
			this.setProjectSettings(projectSettingsLS);
		} else {
			this.setProjectSettings();
		}

		// Check if zones from storage exists and zones is already instantiated
		if (zonesLS != null) {
			// Load the zones from storage
			this.zones = this.hz.convert2FormArray(zonesLS);
		} else {
			this.zones = new FormArray([]);
		}
		// Check work areas
		if (workAreasLS != null) {
			
			this.workAreas = this.hwa.mapWorkAreas(workAreasLS, this.zones);
			//console.log(this.workAreas.controls);
		} else {
			this.workAreas = new FormArray([]);
		}
		this.zonesManager = new ZonesManager(this.storage, this.zones);

		for (let zone of this.zones.controls) {
			let notFound: boolean = true;
			for (let area of this.workAreas.controls) {
				if (zone.get('workArea').value == area.get('name').value) {
					notFound = false;
					break;
				}
			}
			if (notFound) {
				zone.get('workArea').setValue('None');
			}
			
		}
		//this.subscriptionInit();
  }

	ngOnDestroy() {
		this.businessDefaults$.unsubscribe();
		this.projectSettings$.unsubscribe();
		this.zones$.unsubscribe();
		this.workAreas$.unsubscribe();
	}
}

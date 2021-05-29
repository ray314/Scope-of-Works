import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable({providedIn: 'root'})
export class HandleForms {

  constructor(private fb: FormBuilder) {}

  /**
   * Converts the form data from local storage to FormGroup
   * @param data - Data from local storage
   * @returns A FormGroup
   */
  public loadBusinessDefaults(data: any): FormGroup {
    return this.fb.group({
      companyName: [
        data.companyName,
        [Validators.required,
        Validators.minLength(4)]],
      yourName: [
        data.yourName,
        [Validators.required,
        Validators.minLength(4)]],
      // People and pricing
      peoplePricing: this.fb.group(data.peoplePricing),
      // Site Sign
      siteSign: [data.siteSign],
      // Sub Trades
      subTrades: this.fb.group(data.subTrades),
      // Job rates
      jobRates: this.fb.group(data.jobRates)
    });
  }

  /**
   * Converts local storage data to FormGroup
   * @param data The data from local storage
   * @returns A FormGroup for project settings form
   */
  public loadProjectSettings(data: any): FormGroup {
    return this.fb.group({
      address: [data.address,
        [Validators.required,
        Validators.minLength(10)]],
      client: [data.client],
      projectDescription: [data.projectDescription],
  
      peoplePricing: this.fb.group(data.peoplePricing),
  
      siteArrangement: this.fb.group(data.siteArrangement),
  
      safetyRequirements: this.fb.group(data.safetyRequirements),
  
      allowancesInsurances: this.fb.group(data.allowancesInsurances),
  
      professionalServices: this.fb.group(data.professionalServices),
  
      interior: this.fb.group({
        material: this.fb.group(data.interior.material),
  
        style: this.fb.group(data.interior.style)
      }),
  
      exterior: this.fb.group({
        material: this.fb.group(data.exterior.material),
  
        type: this.fb.group(data.exterior.type)
      }),
  
      otherComments: [data.otherComments]
    });
  }
}
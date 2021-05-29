import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";

/**
 * A class for managing a collection of work areas
 */
export class WorkAreasManager {
  workAreas: FormArray;

  private fb: FormBuilder;

  /**
   * Instantiates this object with or without a work area.
   * If no existing work area is passed in, a new one is created instead
   * @param area The existing work area FormGroup
   */
  constructor(workAreas?: FormArray) {
    this.fb = new FormBuilder();
    if (workAreas != null) {
      this.workAreas = workAreas;
    } else {
      this.workAreas = this.fb.array([], Validators.required);
    }
  }

  /**
   * Adds a work area to the end of the list
   */
  public addWorkArea() {
    let area = this.fb.group({
      name: ['', [RxwebValidators.unique(), Validators.required]],
      overview: [''],
      zones: this.fb.array([], Validators.required)
    });
    this.workAreas.push(area);
  }

  /**
   * Returns the work area given an ID
   * @param id The ID of the work area
   * @returns FormGroup object
   */
  public getWorkArea(id: number): FormGroup {
    return this.workAreas.controls[id] as FormGroup;
  }

  /**
   * Check all names for uniqueness
   */
  public checkAllNames() {
    for (let i of this.workAreas.controls) {
      i.get('name').updateValueAndValidity();
    }
  }

  /**
   * 
   * @param id Returns the name of the work area by ID
   * @returns a String
   */
  public getName(id: number): string {
    //console.log(id);
    return this.workAreas.controls[id].get('name').value;
  }

  /**
   * Sets the name of the work area by ID
   * @param id The ID of the area
   * @param name The new name
   */
  public setName(id: number, name: string) {
    this.workAreas.controls[id].get('name').setValue(name);
  }

  /**
   * Returns the zone from the specified ID
   * @param id The ID of the work area
   * @param idZone The ID of the zone
   */
  public getZone(id: number, idZone: number): FormGroup {
    let zones = this.workAreas.controls[id].get('zones') as FormArray;
    return zones.controls[idZone] as FormGroup;
  }

  /**
   * Sets the overview value of this area
   * @param id - The area ID
   * @param value - The string value
   */
  public setOverview(id: number, value: string) {
    this.workAreas.controls[id].get('overview').setValue(value);
  }

  /**
   * Returns the overview for this area
   * @param id - The area ID
   */
  public getOverview(id: number) {
    return this.workAreas.controls[id].get('overview').value;
  }

  /**
   * Allocates a zone to this work area
   * @param areaID The ID of the work area
   * @param zone The zone as FormControl
   */
  public addZone(areaID: number, zone: FormControl) {
    let zones = this.workAreas.controls[areaID].get('zones') as FormArray;
    //zones.push(zone);
    zones.push(zone);
  }

  /**
   * Removes a zone in the work area given an ID
   * @param id The ID of the zone in work area
   */
  public removeZone(areaID: number, zoneName: string) {
    let zones = this.workAreas.controls[areaID].get('zones') as FormArray;
    //console.log(zones);
    for (let i = 0; i < zones.length; i++) {
      if (zones.at(i).get('name').value == zoneName) {
        zones.removeAt(i);
        break;
      }
    }
  }

  /**
   * Returns whether the zone exists in the this work area
   * @param id - The ID of the work area
   * @param value - The zone
   */
  public containsZone(id: number, zone: FormGroup): boolean {
    let zones = this.workAreas.controls[id].get('zones') as FormArray;
    for (let i of zones.controls) {
      if (i.value == zone.value) {
        return true;
      }
    }
    return false;
  }
}
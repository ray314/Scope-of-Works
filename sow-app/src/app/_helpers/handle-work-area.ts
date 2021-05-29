import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { HandleZones } from "./handle-zones";
import { ZonesManager } from "./zone";

@Injectable({ providedIn: 'root' })
export class HandleWorkArea {
  constructor(private fb: FormBuilder) { }

  /**
   * Maps data from storage to FormArray
   * @param data - Data from local storage
   * @returns A FormArray for Work areas
   */
  public mapWorkAreas(data: any, zonesData: FormArray): FormArray {
    let workAreas = this.fb.array([], Validators.required);
    let zonesManager: ZonesManager;
    
    //let hz = new HandleZones(this.fb); // We use a method from HandleZones to convert zones to FormArray
    // A work area contains a FormGroup
    for (let i of data) {
      let zones = this.fb.array([], Validators.required);
      // Then we create a FormGroup to store the name, overview, and FormArray
      let formGroup = this.fb.group({
        name: [i.name, [RxwebValidators.unique(), Validators.required]],
        overview: i.overview,
        zones: zones // We need to map the zones from the zones list
      });
      zonesManager = new ZonesManager(null,zonesData);
      // Map the assigned zones to work area so we can use their observables
      for (let zone of zonesData.controls) {
        let name = formGroup.get('name').value;
        let workArea = zone.get('workArea').value;
        if (workArea == name && name != '') {
          let zoneFG = zone as FormGroup;
          zones.push(zone.get('name'));
          // Set the work area name control to the zone
          //zoneFG.setControl('workArea', formGroup.get('name'));
          //zoneFG.get('workArea').clearValidators();
          //console.log(zones.value);
        }
      }
      //console.log(zones);
      workAreas.push(formGroup);
      //console.log(workAreas.value);
    }
    return workAreas;
  }

  /**
   * Sets the object references from work area zones to the zones list
   */
  /*public setZones(zones: FormArray, workAreas: FormArray) {
    for (let area of workAreas.controls) {
      let areaZones = area.get('zones') as FormArray;
      // Get zones from work area
      for (let i = 0; i < areaZones.controls.length; i++) {
        let areaZoneName = areaZones.controls[i].get('name'); 
      }
      
      let areaName = area.get('name').value; 

      for (let j = 0; j < zones.controls.length; j++) {
        let zone = zones.controls[j];
        let zoneName = zone.get('name').value;
        if (areaName == zoneName) {
          let setZone = area as FormGroup;
          setZone.setControl('name', zone);
          console.log(area == zone)
        }
      }
    }
    
  }*/
}
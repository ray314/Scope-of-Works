import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { UniqueValidator, WorkAreaValidator } from "../_directives/customvalidator.directive";

@Injectable({ providedIn: 'root' })
export class HandleZones {

  

  constructor(private fb: FormBuilder) { 
  }
  /**
   * Map the data from storage to FormArray object
   */
  mapZones(zones: FormArray, data?: any) {
    if (data != null) {
      // Create a FormArray for storing details part
      let tradesArray = new FormArray([]);
      for (let formGroup of data.trades) {
        // Iterate through the details and create a FormGroup for each of them
        // Then push them onto the details FormArray
        tradesArray.push(this.fb.group(formGroup));
      }
      // Create a FormGroup from the above data then push to zones list
      zones.push(this.fb.group({
        name: [data.name, [UniqueValidator(zones), Validators.required]],
        description: [data.description, Validators.required],
        trades: tradesArray,
        workArea: [data.workArea, WorkAreaValidator(/None/i)]
      }));
    } 
  }

  /**
   * Adds a detail column to the zone
   * @param trade - The trade for the row
   */
  addTrade(trade: string, detail = '', allowance = ''): FormGroup {
    let detailGroup = this.fb.group({
      trade: trade,
      detail: detail,
      allowance: allowance
    })
    return detailGroup;
  }

  /**
   * Converts a object to a zones FormArray from local storage
   * @param data - The object from local storage
   * @returns A FormArray
   */
  convert2FormArray(data: any): FormArray {
    let zoneArray = new FormArray([], Validators.required);
    //console.log(data);

    //console.log(test);
    for (let zone of data) {

      this.mapZones(zoneArray, zone);
      /*for (let i = 0; i < zone.details.length; i++) {
        //console.log(data.details[i])
        formArray.push(this.addDetail(zone.details[i].trade,
          zone.details[i].detail, zone.details[i].allowance));
      }
      zone.details = formArray;
      console.log(formArray);
      //this.addZone(zone);*/
    }
    return zoneArray;
  }



}
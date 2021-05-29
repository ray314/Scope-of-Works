import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { LocalStorageService } from "ngx-webstorage";
import { merge } from "rxjs";
import { WorkAreaValidator } from "../_directives/customvalidator.directive";
import { FormService } from "../_services/form.service";

/**
 * A class to manipulate the FormArray of Zones
 */
export class ZonesManager {

  zones: FormArray;

  private fb: FormBuilder;

  /**
   * Initialises the Zone object. If Zone is not passed in, a new one is created instead
   * @param zone A FormGroup object
   */
  constructor(private storage: LocalStorageService, zones?: FormArray) {
    this.fb = new FormBuilder();
    if (zones != null) {
      this.zones = zones;
    } else {
      // Create a new zone
      this.zones = this.fb.array([], Validators.required);
    }
  }

  /**
   * Adds a zone to the list with the default settings
   */
  public addZone() {
    let name = new FormControl('', [RxwebValidators.unique(), Validators.required]);
    let description = new FormControl('', Validators.required);
    let trades = this.fb.array([
      this.addTrade('Carpentry','')
    ])
    let workArea = this.fb.control('None', WorkAreaValidator(/None/i));
    // Merge all observables into one
    merge(
      name.valueChanges,
      description.valueChanges,
      trades.valueChanges,
      workArea.valueChanges
    ).subscribe((data) => {
      //console.log(this.zones);
      this.storage.clear('zones');
      this.storage.store('zones', this.zones.getRawValue());
      
    });

    this.zones.push(this.fb.group({
      // Added in custom validator for unique names
      name: name,
      description: description,
      trades: trades,
      workArea: workArea
    }));
  }

  /**
   * Adds a detail column to the zone
   * @param - The name for the row
   */
  addTrade(trade: string, detail = '', allowance = ''): FormGroup {
    /*let detailGroup = this.fb.group({
      name: [name],
      detail: [''],
      allowance: ['']
    })*/
    let tradeGroup = this.fb.group({
      trade: trade,
      detail: detail,
      allowance: allowance
    })
    return tradeGroup;
  }

  public removeZone(id: number) {
    this.zones.removeAt(id);
  }

  /**
   * Returns the name of a zone given an ID
   * @param id - The zone ID in the array
   * @returns - A string
   */
  public getName(id: number): string {
    return this.zones.controls[id].get('name').value;
  }

  /**
   * Set the name of a zone
   * @param id - The ID of the zone
   * @param name - The name in String
   */
  public setName(id: number, name: string) {
    this.zones.controls[id].get('name').setValue(name);
  }

  /**
   * Inserts a new row at the end in the zone
   * @param id - The ID of the zone
   */
  public addRow(id: number) {
    let trades = this.zones.controls[id].get('trades') as FormArray;
    // Details consist of rowName, detail, allowance
    trades.push(this.fb.group({
      trade: ['Carpentry'],
      detail: [''],
      allowance: ['']
    }));
  }

  /**
   * Returns the row of the details array as a FormGroup
   * @param zoneID - The zone ID
   * @param rowID - The row ID
   * @returns The FormGroup object of the detail
   */
  public getRow(zoneID: number, rowID: number): FormGroup {
    let trades = this.zones.controls[zoneID].get('trades') as FormArray;
    let trade = trades[rowID] as FormGroup;
    return trade;
  }

  /**
   * Returns the work area from a zone in the list
   * @param id - The ID of the zone in the list
   * @returns A string name of work area
   */
  public getWorkArea(id: number): FormControl {
    return this.zones.at(id).get('workArea') as FormControl;
  }

  /**
   * Sets the work area on this zone
   * @param zoneName - The name of the zone
   * @param workArea The work area FormGroup object
   */
  public setWorkArea(zoneName: string, workArea: FormControl) {
    for (let i = 0; i < this.zones.length; i++) {
      if (this.getName(i) == zoneName) {
        let zone = this.zones.controls[i] as FormGroup;
        zone.setControl('workArea', workArea)
        //this.getWorkArea(i).setValue(workArea);
        break;
      }
    } 
  }

  /**
   * Check if zones is valid without including work area
   */
  public isZonesValid(): boolean {
    for (let zone of this.zones.controls) {
      if (!(zone.get('name').valid && zone.get('description').valid)) {
        return false;
      }
    }
    return true;
  }

}
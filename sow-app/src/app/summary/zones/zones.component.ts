import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { HandleZones } from 'src/app/_helpers/handle-zones';
import { ZonesManager } from 'src/app/_helpers/zone';
import { FormService } from 'src/app/_services/form.service';
import { AppService } from '../../_services';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class ZonesComponent implements OnInit {

  zones: FormArray;
  zonesManager: ZonesManager;
  editField: string;
  tableClass = "table-primary";

  // The service
  constructor(public formService: FormService, private fb: FormBuilder,
    private router: Router, private dialog: MatDialog,
    private storage: LocalStorageService, public hz: HandleZones) { }

  headElements = ['Name', 'Edit', 'Remove', 'Work Breakdown Area'];
  id: any;

  /**
   * Adds a new zone to the table
   */
  public addNewZone() {
    this.zonesManager.addZone();
    this.zones.updateValueAndValidity();
  }

  /**
   * Edits a zone on the table
   * @param id The ID of the zone
   */
  edit(id: number) {
    // Pass in the id then navigate to the zone
    this.router.navigate(['/zone', id]);
  }

  /**
   * Removes a zone from the table
   * @param id The ID of the zone
   */
  remove(id: number) {
    // Use a dialog to ask for confirmation whether to remove it or not
    let dialogRef = this.dialog.open(DialogComponent);
    let dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result == 1) { // 1 is remove
        this.zonesManager.removeZone(id);
      }
      dialogSub.unsubscribe();
    });
  }

  /**
   * Changes the value of the field
   * @param id The ID
   * @param property The property name
   * @param event The event
   */
  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
    //this.zones[id].name = this.editField;
  }

  ngOnInit(): void {

    this.zones = this.formService.zones;
    this.zones.markAllAsTouched();
    // Have to manually trigger validation for unique name due to limitations
    // of rxweb/validators
    for (let zone of this.zones.controls) {
      zone.get('name').updateValueAndValidity();
    }
    
    this.zonesManager = new ZonesManager(this.storage, this.zones);
  }
}
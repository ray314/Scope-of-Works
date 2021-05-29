import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from 'ngx-webstorage';
import { Subscription } from 'rxjs';
import { HandleWorkArea } from 'src/app/_helpers/handle-work-area';
import { HandleZones } from 'src/app/_helpers/handle-zones';
import { WorkAreasManager } from 'src/app/_helpers/work-area';
import { ZonesManager } from 'src/app/_helpers/zone';
import { AppService } from 'src/app/_services';
import { FormService } from 'src/app/_services/form.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-work-area-breakdown',
  templateUrl: './work-area-breakdown.component.html',
  styleUrls: ['./work-area-breakdown.component.scss']
})
export class WorkAreaBreakdownComponent implements OnInit, OnDestroy {

  // These property is for viewing on the html part. The one to be modified is the one from app.service
  workAreas: FormArray;
  @ViewChild('selectArea') selectArea: ElementRef;
  private sub: Subscription[]; // For zone names
  zones: FormArray;
  area: FormGroup;

  workAreaManager: WorkAreasManager;
  zonesManager: ZonesManager;

  constructor(private formService: FormService, private storage: LocalStorageService,
    private hz: HandleZones, private hwa: HandleWorkArea, private dialog: MatDialog) { }

  /**
   * Adds a new work area to the table
   */
  addWorkArea() {
    // A work area has a name, overview and a collection of zones
    this.workAreaManager.addWorkArea();
  }


  // These variables store the previous state
  previousAreaID: number;
  previousZoneName: string;
  /**
   * Event handling when user focuses on the select options
   * @param areaID - The ID of the current area
   * @param zoneID - The ID of the current zone
   */
  onZoneClick(areaID: number, zoneName: string) {
    this.previousZoneName = zoneName;
    this.previousAreaID = areaID;
    //console.log(areaID);
  }


  /**
   * Event handling when the select option changes
   * @param previousArea - Previous ID of area
   * @param previousZone - Previous ID of Zone
   * @param newArea - The new ID of area
   * @param newZone - The new ID of zone
   */
  onZoneChange(event: any, newAreaID: number, newZoneName: string, newZone: FormControl) {
    // If the previous area is not empty then remove it
    if (this.previousAreaID != -1) {
      this.workAreaManager.removeZone(this.previousAreaID, this.previousZoneName);
    }

    this.workAreaManager.addZone(newAreaID, newZone);
    // Set the workArea of zone object
    //newArea.controls['workArea'] = this.appService.workAreas.controls[newAreaID].get('name');

    // Assign work Area to the selected zone
    let workArea = this.workAreaManager.getWorkArea(newAreaID).get('name') as FormControl;
    this.zonesManager.setWorkArea(newZoneName, workArea);
    this.zones.updateValueAndValidity();
    this.previousAreaID = newAreaID;
    this.previousZoneName = newZoneName;
    //console.log(this.workAreas);
  }

  /**
   * Removes a work area from the table
   * @param id The ID of the work area
   */
  removeWorkArea(id: number) {

    // Use a dialog to ask for confirmation whether to remove it or not
    let dialogRef = this.dialog.open(DialogComponent);
    let dialogSub = dialogRef.afterClosed().subscribe(result => {
      if (result == 1) { // 1 is remove
        // Find the zone assigned to the work area to be removed
        for (let zone of this.zones.controls) {
          let fc = zone.get('workArea');
          if (fc.value == this.workAreaManager.getName(id)) {
            //console.log("found zone: " + fc.value);
            // Unassign work area from the zone
            fc.setValue('None');
          }
        }
        this.workAreas.removeAt(id);
      }
      // Unsubscribe to prevent memory leaks
      dialogSub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.workAreas = this.formService.workAreas;
    this.workAreaManager = new WorkAreasManager(this.workAreas);
    this.zones = this.formService.zones;

    // Manually trigger validation for all controls
    this.workAreas.markAllAsTouched();
    for (let area of this.workAreas.controls) {
      area.get('name').updateValueAndValidity();
    }

    this.zonesManager = new ZonesManager(this.storage, this.zones);
  }

  ngOnDestroy(): void {
  }
}

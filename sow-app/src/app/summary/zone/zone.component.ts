import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { HandleZones } from 'src/app/_helpers/handle-zones';
import { ZonesManager } from 'src/app/_helpers/zone';
import { FormService } from 'src/app/_services/form.service';

@Component({
  selector: 'app-zone',
  templateUrl: './zone.component.html',
  styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit, OnDestroy {

  zone: FormGroup;
  zones: FormArray;
  zonesManager: ZonesManager;
  id: number;
  private sub: any; // Using ActivatedRoute to load a zone from the table
  trades: FormArray;
  tradePresets: string[];

  constructor(private formService: FormService, private fb: FormBuilder, private route: ActivatedRoute,
    private storage: LocalStorageService, private hz: HandleZones) {
      // Create presets for trade
    this.tradePresets = [
      'Cabinetry',
      'Carpentry',
      'Decks',
      'Decorating and finishes',
      'Demolition',
      'Decorating and finishes',
      'Drainage',
      'Electrical',
      'Excavation',
      'Exterior joinery',
      'Flooring',
      'Gas fitting',
      'Heating and ventilation',
      'Landscaping',
      'Plumbing',
      'Rainwater',
      'Roofing',
      'Scaffolding',
      'Tiling',
      'Other'
    ];
  }

  /**
   * Adds a trade to the zone
   */
  addTrade() {
    let tradeGroup = this.zonesManager.addTrade('', '');
    this.trades.push(tradeGroup);
  }

  /**
   * Removes a trade from this current zone
   * @param id The ID of the trade
   */
  removeTrade(id: number) {
    this.trades.removeAt(id);
  }

  ngOnInit() {
    // Retrieve zones first
    if (this.formService.zones == null) {
      this.formService.ngOnInit();
    }
    this.zones = this.formService.zones;
    this.zonesManager = new ZonesManager(this.storage, this.zones);
    
    
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      // Downcast AbstractControl to FormGroup
      this.zone = <FormGroup>this.zones.controls[this.id];
      //console.log(this.zone.controls['trades']);
      // Downcast AbstractControl to FormArray
      this.trades = <FormArray>this.zone.controls['trades'];
      //sconsole.log(this.zone);
    });
  }

  ngOnDestroy() {
    // Unsubscribe when component is closed
    this.sub.unsubscribe();
  }
}

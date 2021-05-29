import { Component, OnInit } from '@angular/core';
import { AppService } from './_services';
import { FormService } from './_services/form.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private service: AppService, private formService: FormService) {

  }
  ngOnInit(): void {
    this.formService.ngOnInit();
    this.formService.subscriptionInit();
  }
}

import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})


export class ContactComponent implements OnInit {

  FirstName = new FormControl('');
  LastName = new FormControl('');
  EmailAddress = new FormControl('');
  PhoneNumber = new FormControl('');
  Subject = new FormControl('');
  Description = new FormControl('');

  constructor() { }

  ngOnInit(): void {
  }

}

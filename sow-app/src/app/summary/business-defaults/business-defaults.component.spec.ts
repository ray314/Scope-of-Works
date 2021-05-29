import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BusinessDefaultsComponent } from './business-defaults.component';

describe('BusinessDefaultsComponent', () => {
  let component: BusinessDefaultsComponent;
  let fixture: ComponentFixture<BusinessDefaultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessDefaultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessDefaultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

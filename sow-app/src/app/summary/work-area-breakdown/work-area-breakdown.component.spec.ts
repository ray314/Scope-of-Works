import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { WorkAreaBreakdownComponent } from './work-area-breakdown.component';

describe('WorkAreaBreakdownComponent', () => {
  let component: WorkAreaBreakdownComponent;
  let fixture: ComponentFixture<WorkAreaBreakdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkAreaBreakdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkAreaBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

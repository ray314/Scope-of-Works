import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ZoneComponent } from './zone.component';

describe('ZoneComponent', () => {
  let component: ZoneComponent;
  let fixture: ComponentFixture<ZoneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

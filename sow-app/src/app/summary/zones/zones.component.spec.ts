import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ZonesComponent } from './zones.component';

describe('ZonesComponent', () => {
  let component: ZonesComponent;
  let fixture: ComponentFixture<ZonesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

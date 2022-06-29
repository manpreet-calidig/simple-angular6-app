import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAttendancePercentageComponent } from './emp-attendance-percentage.component';

describe('EmpAttendancePercentageComponent', () => {
  let component: EmpAttendancePercentageComponent;
  let fixture: ComponentFixture<EmpAttendancePercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpAttendancePercentageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpAttendancePercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

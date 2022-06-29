import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeattendanceComponent } from './employeeattendance.component';

describe('EmployeeattendanceComponent', () => {
  let component: EmployeeattendanceComponent;
  let fixture: ComponentFixture<EmployeeattendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeattendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeattendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

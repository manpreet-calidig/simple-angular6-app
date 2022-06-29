import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditholidayComponent } from './editholiday.component';

describe('EditholidayComponent', () => {
  let component: EditholidayComponent;
  let fixture: ComponentFixture<EditholidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditholidayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditholidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

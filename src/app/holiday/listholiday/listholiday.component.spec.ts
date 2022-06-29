import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListholidayComponent } from './listholiday.component';

describe('ListholidayComponent', () => {
  let component: ListholidayComponent;
  let fixture: ComponentFixture<ListholidayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListholidayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListholidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListleavetypeComponent } from './listleavetype.component';

describe('ListleavetypeComponent', () => {
  let component: ListleavetypeComponent;
  let fixture: ComponentFixture<ListleavetypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListleavetypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListleavetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

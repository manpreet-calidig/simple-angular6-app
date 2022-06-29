import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListleaveBalanceComponent } from './listleave-balance.component';

describe('ListleaveBalanceComponent', () => {
  let component: ListleaveBalanceComponent;
  let fixture: ComponentFixture<ListleaveBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListleaveBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListleaveBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

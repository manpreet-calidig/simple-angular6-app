import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListoverviewComponent } from './listoverview.component';

describe('ListoverviewComponent', () => {
  let component: ListoverviewComponent;
  let fixture: ComponentFixture<ListoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListoverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListreportComponent } from './listreport.component';

describe('ListreportComponent', () => {
  let component: ListreportComponent;
  let fixture: ComponentFixture<ListreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

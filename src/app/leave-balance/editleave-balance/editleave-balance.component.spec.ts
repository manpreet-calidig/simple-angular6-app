import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditleaveBalanceComponent } from './editleave-balance.component';

describe('EditleaveBalanceComponent', () => {
  let component: EditleaveBalanceComponent;
  let fixture: ComponentFixture<EditleaveBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditleaveBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditleaveBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

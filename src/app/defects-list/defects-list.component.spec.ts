import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectsListComponent } from './defects-list.component';

describe('DefectsListComponent', () => {
  let component: DefectsListComponent;
  let fixture: ComponentFixture<DefectsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefectsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefectsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

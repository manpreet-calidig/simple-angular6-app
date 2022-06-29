import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalidigTeamComponent } from './calidig-team.component';

describe('CalidigTeamComponent', () => {
  let component: CalidigTeamComponent;
  let fixture: ComponentFixture<CalidigTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalidigTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalidigTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

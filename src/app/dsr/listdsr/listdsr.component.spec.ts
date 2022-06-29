import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListdsrComponent } from './listdsr.component';

describe('ListdsrComponent', () => {
  let component: ListdsrComponent;
  let fixture: ComponentFixture<ListdsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListdsrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListdsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeadsChart } from './leads-chart';

describe('LeadsChart', () => {
  let component: LeadsChart;
  let fixture: ComponentFixture<LeadsChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsChart],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadsChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

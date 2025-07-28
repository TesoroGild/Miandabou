import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsPage } from './bills.page/bills.page';

describe('BillsPage', () => {
  let component: BillsPage;
  let fixture: ComponentFixture<BillsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

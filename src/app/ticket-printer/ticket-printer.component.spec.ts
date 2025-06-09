import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPrinterComponent } from './ticket-printer.component';

describe('TicketPrinterComponent', () => {
  let component: TicketPrinterComponent;
  let fixture: ComponentFixture<TicketPrinterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketPrinterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketPrinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

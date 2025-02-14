import { TestBed } from '@angular/core/testing';

import { InvoiceGenerationService } from './invoice-generation.service';

describe('InvoiceGenerationService', () => {
  let service: InvoiceGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@services/node_modules/@angular/core/testing';

import { TicketService } from './ticket.service';

describe('OrderService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: TicketService = TestBed.get(TicketService);
		expect(service).toBeTruthy();
	});
});

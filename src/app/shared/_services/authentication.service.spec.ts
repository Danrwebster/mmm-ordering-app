import { TestBed } from '@services/node_modules/@angular/core/testing';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: AuthenticationService = TestBed.get(AuthenticationService);
		expect(service).toBeTruthy();
	});
});

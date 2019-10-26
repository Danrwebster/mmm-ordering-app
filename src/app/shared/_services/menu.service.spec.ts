import { TestBed } from '@services/node_modules/@angular/core/testing';

import { MenuService } from './menu.service';

describe('MenuServiceService', () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it('should be created', () => {
		const service: MenuService = TestBed.get(MenuService);
		expect(service).toBeTruthy();
	});
});

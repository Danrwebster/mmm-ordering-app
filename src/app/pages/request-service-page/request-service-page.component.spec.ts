import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestServicePageComponent } from './request-service-page.component';

describe('RequestServicePageComponent', () => {
	let component: RequestServicePageComponent;
	let fixture: ComponentFixture<RequestServicePageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RequestServicePageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RequestServicePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

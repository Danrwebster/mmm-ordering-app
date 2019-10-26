import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusPageComponent } from './order-status-page.component';

describe('OrderStatusComponent', () => {
	let component: OrderStatusPageComponent;
	let fixture: ComponentFixture<OrderStatusPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OrderStatusPageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrderStatusPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDrawerComponent } from './order-drawer.component';

describe('OrderDrawerComponent', () => {
	let component: OrderDrawerComponent;
	let fixture: ComponentFixture<OrderDrawerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OrderDrawerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OrderDrawerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

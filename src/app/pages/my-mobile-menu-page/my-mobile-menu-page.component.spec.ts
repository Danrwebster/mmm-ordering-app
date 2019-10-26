import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMobileMenuPageComponent } from './my-mobile-menu-page.component';

describe('MyMenuPageComponent', () => {
	let component: MyMobileMenuPageComponent;
	let fixture: ComponentFixture<MyMobileMenuPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MyMobileMenuPageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MyMobileMenuPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

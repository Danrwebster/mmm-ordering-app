import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { TicketService } from '@services/ticket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
	selector: 'app-nav-bar',
	templateUrl: './nav-bar.component.html',
	styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {

	@Output() sideNav = new EventEmitter<boolean>();

	private _tabItemCount: number = 0;
	private _subscription = new Subscription;

	constructor(
		private _router: Router,
		private _ticketService: TicketService) { }

	ngOnInit() {
		const tabSub = this._ticketService.$tab.subscribe(value => {
			this._tabItemCount = value.items.length;
		});
		this._subscription.add(tabSub);
	}

	ngOnDestroy() {
		this._subscription.unsubscribe();
	}

	public get showOrders(): boolean {
		return false;
	}

	public toggleMenu(value: boolean): void {
		this.sideNav.emit(value);
	}

	public noOrders(): boolean {
		return true;
	}

	public noTab(): boolean {
		return this._tabItemCount === 0 ? true : false;
	}

	public get tabItemCount(): string {
		return this._tabItemCount + '';
	}

	public get loginPage(): boolean {
		return this._router.url.split('?')[0] === '/login';
	}

}

import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { TicketService } from '@services/ticket.service';
import { IMenuItemDetails } from '@models/menu.model';
import { ITicketItem } from '@models/ticket.model';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-order-drawer',
	templateUrl: './order-drawer.component.html',
	styleUrls: ['./order-drawer.component.scss']
})
export class OrderDrawerComponent implements OnInit, OnDestroy {

	@Output() back = new EventEmitter();
	@Output() submit = new EventEmitter();

	private _ticketItem = <ITicketItem>{};
	private _subscription = new Subscription;

	constructor(
		private _ticketService: TicketService
	) { }

	ngOnInit() {
		const ticketSub = this._ticketService.$ticketItem.subscribe(value => this._ticketItem = value);
		this._subscription.add(ticketSub);
	}

	ngOnDestroy() {
		this._ticketService.clearTicket();
		this._subscription.unsubscribe();
	}

	public backButton(event: Event) {
		event.stopPropagation();
		this.back.emit();
	}

	public submitButton(event: Event) {
		event.stopPropagation();
		this.submit.emit();
	}

	public get ticketItem(): ITicketItem {
		return this._ticketItem;
	}
}

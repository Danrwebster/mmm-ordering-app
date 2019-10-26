import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { ITicket, ITicketItem, ITicketTotals, IPrice } from '@models/ticket.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
	providedIn: 'root'
})
export class TicketService {

	// private _url = 'SOME KIND OF INTERNAL API';
	private taxRate = 0.05;
	private _ticketItem: ITicketItem = {
		title: '',
		selectedOptions: [],
		itemSubTotal: {
			value: 0
		}
	};
	private _tab: ITicket = {
		items: [],
		discounts: [],
		totals: {
			subTotal: {
				value: 0
			},
			taxes: [],
			total: {
				value: 0
			}
		}
	};
	public $ticketItem = new BehaviorSubject<ITicketItem>(this._ticketItem);
	public $tab = new BehaviorSubject<ITicket>(this._tab);

	constructor(
		private _http: HttpClient
	) { }

	public getTab(): Observable<ITicket> {
		// How to determine user's order when client has no order information
		// Session cookies, user-authentication?
		// const httpHeaders = new HttpHeaders()
		// 	.set('Content-Type', 'application/json');
		// const options = {
		// 	headers: httpHeaders
		// };
		// return this._http.get<ITicket>(this._url, options);

		return of(this._tab);
	}

	public getItem(): Observable<ITicketItem> {
		// How to determine user's order when client has no order information
		// Session cookies, user-authentication?
		// const httpHeaders = new HttpHeaders()
		// 	.set('Content-Type', 'application/json');
		// const options = {
		// 	headers: httpHeaders
		// };
		// return this._http.get<ITicket>(this._url, options);

		return of(this._ticketItem);
	}

	public updateItem(item: ITicketItem): Observable<ITicketItem> {
		// Must include order identifier in parameters
		// const httpHeaders = new HttpHeaders()
		// 	.set('Content-Type', 'application/json');
		// const options = {
		// 	headers: httpHeaders
		// };
		// return this._http.put<ITicket>(this._url, { orderIndex, item }, options);

		const newTicketItem = item;
		newTicketItem.itemSubTotal = this.calcItemSubTotal(newTicketItem);
		this._ticketItem = newTicketItem;
		this.$ticketItem.next(newTicketItem);
		return of(newTicketItem);
	}

	public clearTicket(): Observable<ITicketItem> {
		// Must include order identifier in parameters
		// Endpoint must be for order-level deletion
		// const httpHeaders = new HttpHeaders()
		// 	.set('Content-Type', 'application/json');
		// const options = {
		// 	headers: httpHeaders
		// };
		// return this._http.delete<ITicket>(this._url, options);

		const newTicketItem = <ITicketItem>{};
		this._ticketItem = newTicketItem;
		this.$ticketItem.next(newTicketItem);
		return of(newTicketItem);
	}

	public clearTab(): Observable<ITicket> {
		// Must include order identifier in parameters
		// Endpoint must be for order-level deletion
		// const httpHeaders = new HttpHeaders()
		// 	.set('Content-Type', 'application/json');
		// const options = {
		// 	headers: httpHeaders
		// };
		// return this._http.delete<ITicket>(this._url, options);

		const newTab = {
			items: [],
			discounts: [],
			totals: {
				subTotal: {
					value: 0
				},
				taxes: [],
				total: {
					value: 0
				}
			}
		};
		this._tab = newTab;
		this.$tab.next(newTab);
		return of(newTab);
	}

	public submitTicket(): Observable<ITicket> {
		// Must include order identifier in parameters
		// const httpHeaders = new HttpHeaders()
		// 	.set('Content-Type', 'application/json');
		// const options = {
		// 	headers: httpHeaders
		// };
		// return this._http.put<ITicket>(this._url, { 'action': 'submit' }, options);

		const newTab = this._tab;
		newTab.items.push(this._ticketItem);
		newTab.totals = this.calcTicketTotals(newTab);
		this._tab = newTab;
		this.$tab.next(newTab);
		this.clearTicket();
		return of(this._tab);
	}

	private calcItemSubTotal(item: ITicketItem): IPrice {
		const subTotal = {
			value: 0.00
		};

		let optionsTotal = 0;
		item.selectedOptions.forEach(option => {
			if (option.priceLevel) {
				optionsTotal += option.priceLevel.value;
			}
		});

		let modifiersTotal = 0;
		if (item.selectedModifiers) {
			item.selectedModifiers.forEach(modifier => {
				if (modifier.priceLevel) {
					modifiersTotal += modifier.priceLevel.value;
				}
			});
		}

		subTotal.value += optionsTotal + modifiersTotal;

		return subTotal;
	}

	private calcTicketTotals(ticket: ITicket): ITicketTotals {
		const calcTotals = {
			subTotal: {
				value: 0.00
			},
			taxes: [{
				value: 0.00
			}],
			total: {
				value: 0.00
			},
		};

		ticket.items.forEach(item => {
			let optionsTotal = 0;
			item.selectedOptions.forEach(option => {
				if (option.priceLevel) {
					optionsTotal += option.priceLevel.value;
				}
			});

			let modifiersTotal = 0;
			item.selectedModifiers.forEach(modifier => {
				if (modifier.priceLevel) {
					modifiersTotal += modifier.priceLevel.value;
				}
			});

			calcTotals.subTotal.value += (optionsTotal + modifiersTotal);
		});

		calcTotals.taxes[0].value = (calcTotals.subTotal.value * this.taxRate);

		calcTotals.total.value = (calcTotals.subTotal.value + calcTotals.taxes[0].value);

		return calcTotals;
	}
}

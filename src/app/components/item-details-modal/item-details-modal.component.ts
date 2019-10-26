import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { IMenuItemDetails, IModifier } from '@models/menu.model';
import { TicketService } from '@services/ticket.service';
import { Subscription } from 'rxjs';
import { ITicketItem } from '@models/ticket.model';

@Component({
	selector: 'app-item-details-modal',
	templateUrl: './item-details-modal.component.html',
	styleUrls: ['./item-details-modal.component.scss']
})
export class ItemDetailsModalComponent implements OnInit, AfterViewInit, OnDestroy {

	@Input() item: IMenuItemDetails;
	@Output() cancel = new EventEmitter<boolean>();

	private _subscription = new Subscription;
	private _modifiers = new Array();
	private _confirmModal: boolean = false;
	private _selectedItem = <ITicketItem>{
		title: '',
		selectedOptions: [],
		itemSubTotal: {
			formattedPrice: '',
			value: 0
		}
	};

	constructor(
		private _ticketService: TicketService
	) { }

	ngOnInit() {
		// console.log(this.item);
		this._selectedItem.title = this.item.descriptor.title;
		this._selectedItem.selectedOptions[0] = this.item.options[0];
		this._selectedItem.selectedModifiers = [];
		this._ticketService.updateItem(this._selectedItem);
	}

	ngAfterViewInit() {
		window.scroll(0, 0);
	}

	ngOnDestroy() {
		this._subscription.unsubscribe();
	}

	public updateOptions(selection?: IModifier): void {
		this._selectedItem.selectedOptions[0] = selection;
		this._ticketService.updateItem(this._selectedItem);
	}

	public updateModifiers(name: string, modifiers?: IModifier[]): void {
		const index = this._modifiers.indexOf(this._modifiers.find(element => {
			return element.name === name;
		}));
		if (index >= 0) {
			this._modifiers[index] = {
				name: name,
				modifiers: modifiers
			};
		} else {
			this._modifiers.push({
				name: name,
				modifiers: modifiers
			});
		}
		this._selectedItem.selectedModifiers = [];
		this._modifiers.forEach(value => {
			value.modifiers.forEach(v => {
				this._selectedItem.selectedModifiers.push(v);
			});
		});
		this._ticketService.updateItem(this._selectedItem);
	}

	public hideModal(): void {
		this.cancel.emit(true);
	}

	public submit(): void {
		this._ticketService.submitTicket();
		this.cancel.emit(true);
	}

	public get confirmModal(): boolean {
		return this._confirmModal;
	}

	public showConfirm(): void {
		this._confirmModal = true;
	}

	public hideConfirm(): void {
		this._confirmModal = false;
	}
}

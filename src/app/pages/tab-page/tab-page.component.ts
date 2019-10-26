import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketService } from '@services/ticket.service';
import { ITicket } from '@models/ticket.model';
import { Subscription } from 'rxjs';
import { CallService } from '@services/call.service';
import { ModalService, IModalConfig } from '@services/modal.service';

@Component({
	selector: 'app-tab-page',
	templateUrl: './tab-page.component.html',
	styleUrls: ['./tab-page.component.scss']
})
export class TabPageComponent implements OnInit, OnDestroy {

	private _pageTitle: string;
	private _tab: ITicket;
	private _subscription = new Subscription;
	private _modalConfig: IModalConfig = {
		title: 'Ready to Pay?',
		message: 'This will send a message to the server to let them know you are ready to pay the bill.',
		button1: 'Back',
		button2: 'Ready'
	};

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _ticketService: TicketService,
		private _callService: CallService,
		private _modalService: ModalService
	) { }

	ngOnInit() {
		this._pageTitle = this._route.snapshot.data['title'];
		const tabSub = this._ticketService.$tab.subscribe(value => this._tab = value);
		this._subscription.add(tabSub);

		const modalSub = this._modalService.$selection.subscribe(value => this.modalSelection(value));
		this._subscription.add(modalSub);
	}

	ngOnDestroy() {
		this._subscription.unsubscribe();
	}

	public get tab(): ITicket {
		return this._tab;
	}

	public get pageTitle(): string {
		return this._pageTitle;
	}

	public callServer(): void {
		this._callService.callServer('READY_TO_PAY');
	}

	public modalSelection(button: string): void {
		if (button === this._modalConfig.button2) {
			this.callServer();
		}
		this._modalService.resetModal();
	}

	public showConfirm(): void {
		this._modalService.showModal(true, this._modalConfig);
	}
}

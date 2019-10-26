import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { MenuService } from '@services/menu.service';
import { Subscription } from 'rxjs';
import { IMenuItemDetails, IMenu } from './shared/_models/menu.model';
import { AuthenticationService } from '@services/authentication.service';
import { AmplifyService } from 'aws-amplify-angular';
import { PlatformLocation } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { TicketService } from '@services/ticket.service';
import { CallService } from '@services/call.service';
import { ModalService, IModalConfig } from '@services/modal.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

	private _showSideNav: boolean;
	private _showModal: boolean;
	private _showConfigModal: boolean;
	private _subscription = new Subscription;
	private _menuItem = <IMenuItemDetails>{};
	private _authenticated = false;
	private _topMenu: IMenu[] = [];

	public selectedTab: number = 0;

	constructor(
		private _modalService: ModalService,
		private _menuService: MenuService,
		private _ticketService: TicketService,
		private _authenticationService: AuthenticationService,
		private _amplifySerivce: AmplifyService,
		private _platformLocation: PlatformLocation,
		private _snackBar: MatSnackBar,
		private _callService: CallService,
		private _renderer: Renderer2
	) {
		this._platformLocation.onPopState(() => {
			if (this._showModal) {
				this.closeModal(false);
			}
		});
	}

	ngOnInit() {
		this._showModal = false;
		this._menuService.initialize();

		const authSub = this._amplifySerivce.authStateChange$.subscribe(value => {
			this._authenticated = (value.state === 'signedIn') ? true : false;
		});
		this._subscription.add(authSub);

		const itemSub = this._menuService.$menuItem
			.subscribe(value => {
				this._menuItem = value;
				this._showModal = true;
				this._renderer.addClass(document.body, 'noScroll');
				this._menuService.showModal = true;
			});
		this._subscription.add(itemSub);

		const tabItemSub = this._ticketService.$tab.subscribe(value => {
			if (value.items.length > 0) {
				this._snackBar.open('Item Order', 'Success', {
					duration: 2000,
					verticalPosition: 'top'
				});
			}
		});
		this._subscription.add(tabItemSub);

		const callSub = this._callService.$callSent.subscribe(() => {
			this._snackBar.open('Message Server', 'Success', {
				duration: 2000,
				verticalPosition: 'top'
			});
		});
		this._subscription.add(callSub);

		const modalSub = this._modalService.$showModal.subscribe(value => {
			this._showConfigModal = value;
		});
		this._subscription.add(modalSub);

		const menuSub = this._menuService.$topMenu.subscribe(value => {
			if (value.length > 0) {
				this._topMenu = value;
			}
		});
		this._subscription.add(menuSub);
	}

	ngOnDestroy() {
		this._subscription.unsubscribe();
	}

	onActivate(event: Event): void {
		switch (event.constructor.name) {
			case 'TopMenuPageComponent':
			case 'TabPageComponent':
			case 'RequestServicePageComponent':
			case 'ProfileSettingsPageComponent':
			case 'PageNotFoundPageComponent':
			case 'OrderStatusPageComponent':
			case 'OrderHistoryPageComponent':
			case 'MyPersonalMenuPageComponent':
			case 'MenuCategoryPageComponent':
			case 'LoginPageComponent':
			case 'HelpPageComponent':
			case 'AboutPageComponent':
				document.getElementById('content').scroll(0, 0);
				break;
		}
	}

	public get showSideNav(): boolean {
		return this._showSideNav;
	}

	public get showModal(): boolean {
		return this._showModal;
	}

	public get showConfirmationModal(): boolean {
		return this._showConfigModal;
	}

	public get modalConfig(): IModalConfig {
		return this._modalService.modalConfig;
	}

	public get menuItem(): IMenuItemDetails {
		return this._menuItem;
	}

	public get menuCategories(): IMenu[] {
		return this._topMenu;
	}

	public closeModal(value: boolean): void {
		this._menuItem = <IMenuItemDetails>{};
		this._showModal = false;
		this._renderer.removeClass(document.body, 'noScroll');
		if (value) {
			this._menuService.showModal = false;
		}
	}

	public togglesideNav(value: boolean): void {
		if (value) {
			this._showSideNav = !this._showSideNav;
		} else {
			this._showSideNav = false;
		}
	}

	public get isAuthenticated(): boolean {
		return this._authenticated;
	}

	public logout(): void {
		this._ticketService.clearTab();
		this._authenticationService.signOut();
		this.togglesideNav(false);
	}
}

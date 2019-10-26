import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface IModalConfig {
	title: string;
	message: string;
	button1: string;
	button2?: string;
}

@Injectable({
	providedIn: 'root'
})
export class ModalService {

	public $showModal = new Subject<boolean>();
	public $selection = new Subject<string>();
	private _modalInstance: IModalConfig = {
		title: '',
		message: '',
		button1: '',
		button2: undefined
	};

	constructor() {
		this._modalInstance = {
			title: 'Test Title',
			message: 'This is a test message',
			button1: 'Button 1',
			button2: 'Button 2'
		}
	}

	public showModal(state: boolean, modalConfig?: IModalConfig): void {
		if (modalConfig) {
			this._modalInstance = modalConfig;
			this.$showModal.next(state);
		} else {
			this.$showModal.next(false);
		}
	}

	public get modalConfig(): IModalConfig {
		return this._modalInstance;
	}

	public selectButton(selection: string): void {
		this.$selection.next(selection);
	}

	public resetModal(): void {
		this._modalInstance = {
			title: '',
			message: '',
			button1: '',
			button2: undefined
		};
		this.$showModal.next(false);
	}
}

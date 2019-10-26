import { Component, OnInit, Input } from '@angular/core';
import { ModalService, IModalConfig } from '@services/modal.service';

@Component({
	selector: 'app-confirmation-modal',
	templateUrl: './confirmation-modal.component.html',
	styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

	@Input() modalConfig: IModalConfig;

	constructor(
		private _modalService: ModalService
	) { }

	ngOnInit() {
	}

	public button(button: string): void {
		this._modalService.selectButton(button);
	}
}

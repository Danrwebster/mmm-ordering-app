import { Component, OnInit, Input } from '@angular/core';
import { IMenuItemDetails } from '@models/menu.model';

@Component({
	selector: 'app-daily-special-item',
	templateUrl: './daily-special-item.component.html',
	styleUrls: ['./daily-special-item.component.scss']
})
export class DailySpecialItemComponent implements OnInit {

	constructor() { }

	@Input() item: IMenuItemDetails;

	ngOnInit() {
	}

}

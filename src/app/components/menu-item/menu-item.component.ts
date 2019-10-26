import { Component, OnInit, Input } from '@angular/core';
import { IMenuItemDetails } from '@models/menu.model';

@Component({
	selector: 'app-menu-item',
	templateUrl: './menu-item.component.html',
	styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {

	@Input() item: IMenuItemDetails;

	constructor() { }

	ngOnInit() {
	}

}

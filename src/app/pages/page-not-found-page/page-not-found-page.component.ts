import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
	selector: 'app-page-not-found-page',
	templateUrl: './page-not-found-page.component.html',
	styleUrls: ['./page-not-found-page.component.scss']
})
export class PageNotFoundPageComponent implements OnInit {

	constructor(
		private location: Location
	) { }

	ngOnInit() {
	}

	back() {
		this.location.back();
	}
}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-profile-settings-page',
	templateUrl: './profile-settings-page.component.html',
	styleUrls: ['./profile-settings-page.component.scss']
})
export class ProfileSettingsPageComponent implements OnInit {

	private _pageTitle: string;

	constructor(
		private _router: Router,
		private _route: ActivatedRoute
	) { }

	ngOnInit() {
		this._pageTitle = this._route.snapshot.data['title'];
	}

	public get pageTitle(): string {
		return this._pageTitle;
	}

}

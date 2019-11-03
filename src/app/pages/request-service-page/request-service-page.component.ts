import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CallService } from '@services/call.service';
import { timer, Subscription } from 'rxjs';

@Component({
	selector: 'app-request-service-page',
	templateUrl: './request-service-page.component.html',
	styleUrls: ['./request-service-page.component.scss']
})
export class RequestServicePageComponent implements OnInit {

	private _pageTitle: string;
	private _subscription = new Subscription;
	public callInProgress: boolean = false;

	constructor(
		private _router: Router,
		private _route: ActivatedRoute,
		private _callService: CallService
	) { }

	ngOnInit() {
		this._pageTitle = this._route.snapshot.data['title'];
	}

	public get pageTitle(): string {
		return this._pageTitle;
	}

	public callServer(type: string): void {
		this._callService.callServer(type);
		this.callInProgress = true;
		this._subscription = timer(300000).subscribe(() => this.callInProgress = false);
	}

}

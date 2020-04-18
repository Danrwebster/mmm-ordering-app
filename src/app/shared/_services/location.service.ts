import { Injectable, APP_INITIALIZER } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class LocationService {
	private _location: string;
	private _table: string;

	constructor() {
		this._initialize();
	}

	get location(): string {
		return this._location;
	}

	set location(newLocation: string) {
		this._location = newLocation;
		localStorage.setItem('location', this._location);
	}

	get table(): string {
		return this._location;
	}

	set table(newTable: string) {
		this._table = newTable;
		localStorage.setItem('table', this._table);
	}

	private _initialize(): void {
		this._location = localStorage.getItem('location') ? localStorage.getItem('location') : undefined;
	}
}

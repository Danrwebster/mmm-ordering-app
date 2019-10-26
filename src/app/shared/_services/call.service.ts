import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CallService {

	constructor() { }

	public $callSent = new Subject<boolean>();

	public callServer(message: string): Observable<boolean> {
		// Call API Endpoint
		this.$callSent.next(true);
		return of(true);
	}
}

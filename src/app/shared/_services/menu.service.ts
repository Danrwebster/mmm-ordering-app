import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { IMenu, ICategory, IMenuItemDetails, IModifierGroup } from '@models/menu.model';

@Injectable({
	providedIn: 'root'
})
export class MenuService {

	private _url = 'assets/data/';
	private _menuItem = <IMenuItemDetails>{};
	private _showModal = false;
	public $menuItem = new Subject<IMenuItemDetails>();
	public $topMenu = new BehaviorSubject<IMenu[]>([]);

	constructor(
		private _http: HttpClient
	) { }

	public initialize() {
	}

	public getTopMenu(): Observable<HttpResponse<IMenu[]>> {
		return this._http.get<IMenu[]>(this._url + 'menus/top-menu.json', { observe: 'response' })
			.pipe(
				retry(3),
				catchError(this.handleError)
			);
	}

	public getCategoryMenu(categoryId: string): Observable<HttpResponse<ICategory>> {
		return this._http.get<ICategory>(this._url + 'menus/' + categoryId + '/category-list.json', { observe: 'response' })
			.pipe(
				retry(3),
				catchError(this.handleError)
			);
	}

	public getMyMobileMenu(categoryId: string): Observable<HttpResponse<ICategory>> {
		return this._http.get<ICategory>(this._url + 'menus/' + categoryId + '/category-list.json', { observe: 'response' })
			.pipe(
				retry(3),
				catchError(this.handleError)
			);
	}

	private getItemDetails(sku: string): Observable<HttpResponse<IMenuItemDetails>> {
		return this._http.get<IMenuItemDetails>(this._url + 'items/' + sku + '.json', { observe: 'response' })
			.pipe(
				retry(3),
				catchError(this.handleError)
			);
	}

	public lookupItem(sku: string) {
		this.getItemDetails(sku)
			.subscribe(response => {
				this._menuItem.description = response.body.description;
				this._menuItem.descriptor = response.body.descriptor;
				this._menuItem.imageURL = response.body.imageURL ? response.body.imageURL : undefined;
				if (response.body.modifierGroup) {
					this._menuItem.modifierGroup = [];
					response.body.modifierGroup.forEach(value => {
						const modifierGroupItem = <IModifierGroup>{
							'groupName': value.groupName,
							'modifiers': value.modifiers,
							'required': value.required,
							'min': value.min ? value.min : (value.required ? 1 : 0),
							'max': value.max ? value.max : undefined
						};
						this._menuItem.modifierGroup.push(modifierGroupItem);
					});
				} else {
					this._menuItem.modifierGroup = [];
				}
				this._menuItem.myMenu = response.body.myMenu;
				this._menuItem.options = response.body.options;

				this.$menuItem.next(this._menuItem);
			});
	}

	public get menuItem(): IMenuItemDetails {
		return this._menuItem;
	}

	public get showModal(): boolean {
		return this._showModal;
	}

	public set showModal(value: boolean) {
		this._showModal = value;
	}

	public setTopMenu(value: IMenu[]) {
		this.$topMenu.next(value);
	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(
				`Backend returned code ${error.status}, ` +
				`body was: ${error.error}`);
		}
		// return an observable with a user-facing error message
		return throwError(
			'Something bad happened; please try again later.');
	}
}

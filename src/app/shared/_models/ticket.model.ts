import { IModifier } from '@models/menu.model';

export interface IPrice {
	descriptor?: string;
	formattedPrice?: string;
	value: number;
}

export interface ITicketTotals {
	subTotal: IPrice;
	taxes: IPrice[];
	total: IPrice;
}

export interface ITicketItem {
	title: string;
	selectedOptions: IModifier[];
	selectedModifiers?: IModifier[];
	itemSubTotal: IPrice;
}

export interface ITicket {
	items: ITicketItem[];
	discounts?: IPrice[];
	totals: ITicketTotals;
}

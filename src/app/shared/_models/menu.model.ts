export interface IPrice {
	formattedPrice: string;
	value: number;
}

export interface IModifier {
	sku?: string;
	name: string;
	priceLevel?: IPrice;
}

export interface IModifierGroup {
	groupName: string;
	modifiers: IModifier[];
	required: boolean;
	min?: number;
	max?: number;
}

export interface IMenuItemDetails {
	descriptor: {
		title: string;
		id: string;
	};
	description: string;
	imageURL?: string;
	options: IModifier[];
	modifierGroup?: IModifierGroup[];
	myMenu: boolean;
}

export interface IMenuItem {
	descriptor: {
		title: string;
		id: string;
	};
	description: string;
	imageURL?: string;
	options: IModifier[];
	myMenu: boolean;
}

export interface ICategory {
	descriptor: {
		title: string;
		id: string;
	};
	menuItems: IMenuItem[];
}

export interface IMenuDetails {
	title: string;
	imageURL?: string;
	dailySpecial?: IMenuItem;
	footerImage?: string;
	categories: ICategory[];
}

export interface IMenu {
	descriptor: {
		title: string;
		id: string;
	};
	imageURL?: string;
}

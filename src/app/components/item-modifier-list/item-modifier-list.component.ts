import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IModifierGroup, IModifier } from '@models/menu.model';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
	selector: 'app-item-modifier-list',
	templateUrl: './item-modifier-list.component.html',
	styleUrls: ['./item-modifier-list.component.scss']
})
export class ItemModifierListComponent implements OnInit {

	@Input() modifierGroup: IModifierGroup;
	@Output() update = new EventEmitter<IModifier[]>();

	public modifierForm: FormGroup;

	private _modifierArray: Array<IModifier>;
	private _modifierFormArray: FormArray;

	constructor(private _formBuilder: FormBuilder) { }

	ngOnInit() {
		if (this.modifierGroup.max !== 1) {
			this.modifierForm = this._formBuilder.group({
				modifiers: this._formBuilder.array([])
			});
		}
		if (this.modifierGroup.max === 1 && this.modifierGroup.required) {
			this.onSelect(this.modifierGroup.modifiers[0]);
		}
	}

	onChange(modifier: IModifier, isChecked: boolean) {
		this._modifierFormArray = <FormArray>this.modifierForm.controls.modifiers;

		if (isChecked) {
			this._modifierFormArray.push(new FormControl(modifier));
		} else {
			const index = this._modifierFormArray.controls.findIndex(x => x.value.name === modifier.name);
			this._modifierFormArray.removeAt(index);
		}
		this.update.emit(this.modifierForm.value.modifiers);
	}

	onSelect(modifier: IModifier) {
		this._modifierArray = new Array<IModifier>();
		this._modifierArray.push(modifier);
		this.update.emit(this._modifierArray);
	}

	public get selectedLength(): string {
		if (this._modifierArray) {
			return this._modifierArray[0].name;
		} else if (this._modifierFormArray) {
			return this._modifierFormArray.length + ' Selected';
		} else {
			return '';
		}
	}

}

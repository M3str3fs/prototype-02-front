import { IfStmt } from '@angular/compiler';
import { OnInit, Input, Output, EventEmitter, Component, ChangeDetectorRef, ViewChildren, QueryList, ElementRef, SimpleChanges, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { highlight, filter } from './ui-data-selector.utils';

export interface Environment {
    id: string;
    name: string;
}

@Component({
    selector: 'ui-data-selector',
    templateUrl: './ui-data-selector.component.html',
    styleUrls: ['./ui-data-selector.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiDataSelectorComponent),
            multi: true
        }
    ]
})
export class UiDataSelectorComponent<T> implements OnInit, ControlValueAccessor {

    @Input('itens')
    public _itens: T[] = [];

    @Input('query')
    public _query: (text: string) => Promise<T[]>;

    @Input('label')
    public _label: ((item: T, onInput: boolean) => string) | string;

    @Input('placeholder')
    public _placeholder: string = '';

    @Input('per-page')
    public _perPage: number = 5;

    @Input('loading')
    public loading: boolean = false;

    @Input('unselect')
    public _unselect: boolean = true;

    @Input('filter')
    public _filter: boolean = true;

    @Input('disabled')
    public _disabled: boolean = false;

    @Input('model-property')
    public _modelProperty: string = undefined;

    @Output('on-select')
    public _onSelect: EventEmitter<T> = new EventEmitter();

    @Output('ngModelChange')
    public _ngModelChange = new EventEmitter();

    @ViewChildren('itemli')
    public _li: QueryList<ElementRef>;

    public itens: T[] = [];
    public text: string = undefined;
    public selected: T = undefined;
    public pointed: T = undefined;
    public opened: boolean = false;
    public height: number = 0;

    constructor(
        private cdRef: ChangeDetectorRef
    ) {

    }

    public ngOnInit() {
        this.itens = [...this._itens];
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (!this._query && changes['_itens']) {
            this.itens = [...this._itens];
            if (this.isOpened()) {
                this.open();
            }
        }
    }

    public refresh() {
        if (this._query) {
            this._query(this.text).then((itens) => this.itens = itens);
        }
    }

    public setHeight() {
        this.height = this.getHeight(this._perPage);
    }

    public onModelChange: Function = () => { };

    public onModelTouched: Function = () => { };

    public writeValue(model: T): void {
        if (!model) return;
        const _model = this._modelProperty ? this.itens.find(i => i[this._modelProperty] === model) : model;
        this.setSelected(_model);
    }

    public registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    public registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    public setText(text: string) {
        this.text = text;
    }

    public setSelected(item: T, process: boolean = true) {
        this.selected = item;
        if (process) {
            const model = this._modelProperty ? (item ? item[this._modelProperty] : undefined) : item;
            this._onSelect.emit(model);
            this._ngModelChange.emit(model);
            setTimeout(() => {
                this.setText(this.getLabel(item, true));
                this.cdRef.detectChanges();
            }, 0);
        }
    }

    public isSelected(item: T = this.selected) {
        return !!this.selected && this.selected === item;
    }

    public getLabel = (item: T, onInput: boolean = false) => {
        if (!item) {
            return '';
        }
        if (!this._label) {
            return typeof item === 'string' ? item : JSON.stringify(item);
        }
        if (typeof this._label === 'string') {
            return item[this._label];
        }
        return this._label(item, onInput);
    }

    public getHighlighted = (item: T, text: string) => {
        return highlight(this.getLabel(item), text);
    }

    public getItens(text: string, itens: T[] = this.itens, label: ((item: T, onInput: boolean) => string) | string = this.getLabel) {
        return this._filter ? filter(text, itens, this.getLabel) : itens;
    }

    public getHeight(count: number) {
        if (!this._li || !this._li.first) {
            return 0;
        }
        const first = this._li.first.nativeElement as HTMLElement;
        let itens = this.getItens(this.text);
        if (itens.length > 0 && itens.length < count) {
            return first.offsetHeight * itens.length;
        } else {
            return first.offsetHeight * count;
        }
    }

    public getClass(item: T) {
        return {
            // tslint:disable-next-line: object-literal-key-quotes
            'active': item === this.pointed,
            'list-group-item': true,
            'list-group-item-action': true,
            'list-group-item-primary': item === this.selected
        };
    }

    public open() {
        this.opened = true;
        this.text = '';
        this.height = this.getHeight(this._perPage);
        this.cdRef.detectChanges();
    }

    public close() {
        this.selected && this.setText(this.getLabel(this.selected, true));
        this.opened = false;
        this.height = 0;
        this.cdRef.detectChanges();
    }

    public isOpened() {
        return this.opened;
    }

}
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { UiDataFilterStandardOption } from '../ui-data-filter.interface';

@Component({
    selector: 'ui-data-filter-check-component',
    templateUrl: './ui-data-filter-check.component.html',
    styleUrls: ['./ui-data-filter-check.component.scss']
})
export class UiDataFilterCheckComponent implements OnInit {

    @Input('title')
    public _title: string = undefined;

    @Input('options')
    public _options: UiDataFilterStandardOption[] = [];

    @Output('change')
    public _change: EventEmitter<UiDataFilterStandardOption[]> = new EventEmitter();

    public ngOnInit() {

    }

    public getOptionDocumentId(option: UiDataFilterStandardOption) {
        return `${this._title}-${option.label}`;
    }

    public toggleCheck(option: UiDataFilterStandardOption) {
        option.checked = !!!option.checked;
        this._change.emit(this._options);
    }

}
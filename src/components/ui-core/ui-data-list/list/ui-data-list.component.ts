import { Component, Input } from '@angular/core';
import { UiDataList } from '../../../../util/ui-data-list.util';

@Component({
    selector: 'ui-data-list',
    templateUrl: './ui-data-list.component.html',
    styleUrls: ['./ui-data-list.component.scss']
})
export class UiDataListComponent<T> {

    @Input('ui-data-list')
    public _uiDataList: UiDataList = undefined;

    @Input('item-property')
    public _itemProperty: string = undefined;

    @Input('item-property-function')
    public _itemPropertyFunction: (item: T) => string = undefined;

    @Input('removable')
    public _removable: boolean = false;

}
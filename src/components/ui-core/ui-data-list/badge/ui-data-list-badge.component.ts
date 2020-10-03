import { Component, Input } from '@angular/core';
import { UiDataList } from '../../../../util/ui-data-list.util';

@Component({
    selector: 'ui-data-list-badge',
    templateUrl: './ui-data-list-badge.component.html',
    styleUrls: ['./ui-data-list-badge.component.scss']
})
export class UiDataListBadgeComponent {

    @Input('ui-data-list')
    public _uiDataList: UiDataList = undefined;

    @Input('item-property')
    public _itemProperty: string = undefined

    @Input('removable')
    public _removable: boolean = false;

}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UiDataFilterCheckComponent } from './ui-data-filter-check/ui-data-filter-check.component';
import { UiDataSelectorComponent } from './ui-data-selector/ui-data-selector.component';
import { UiDataListBadgeComponent } from './ui-data-list/badge/ui-data-list-badge.component';
import { UiDataListComponent } from './ui-data-list/list/ui-data-list.component';

const COMPONENTES = [
    UiDataFilterCheckComponent,
    UiDataSelectorComponent,
    UiDataListBadgeComponent,
    UiDataListComponent
];

@NgModule({
    declarations: COMPONENTES,
    imports: [CommonModule, FormsModule],
    exports: COMPONENTES
})
export class UiCoreModule { }

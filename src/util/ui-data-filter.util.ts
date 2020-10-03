import { DominioModel } from '../model/dominio.model';
import { UiDataFilterStandardOption } from '../components/ui-core/ui-data-filter.interface';

export function buildUiDataFilterStandardOptionsFromDominios(items: DominioModel[]) {
    return items.map((item) => {
        return { label: item.valor, value: item._id, checked: false } as UiDataFilterStandardOption;
    });
}
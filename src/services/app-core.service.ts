import { Injectable } from '@angular/core';
import { UsuarioDadosMedicosModel } from '../model/usuario-dados-medicos.model';
import { UiDataList } from '../util/ui-data-list.util';
import { AppCoreKeys } from './app-core.keys';

@Injectable({
    providedIn: 'root',
})
export class AppCoreService {


    private contextList: UiDataList<{ key: string, value: any }>;
    private loadList: UiDataList<any>;

    constructor() {
        this.contextList = new UiDataList();
        this.loadList = new UiDataList();
    }

    public set(key: AppCoreKeys, value: any) {
        this.contextList.add({ key, value });
    }

    public get<T>(key: AppCoreKeys) {
        const item = this.contextList.itens().find(i => i.key === key);
        return item ? item.value as T : undefined;
    }

    public setLoading(key: any) {
        this.loadList.add(key);
    }

    public setLoaded(key: any) {
        this.loadList.remove(key);
    }

    public isLoading(key?: any) {
        return key ? this.loadList.has(key) : this.loadList.itens().length > 0;
    }

    public isMedico() {
        const item = this.contextList.itens().find(i => i.key === AppCoreKeys.USUARIO_MEDICO);
        return !!item && !!item.value;
    }

    public isMedicoAtivo() {
        const item = this.contextList.itens().find(i => i.key === AppCoreKeys.USUARIO_MEDICO);
        return !!item && !!item.value && !!(item.value as UsuarioDadosMedicosModel).ativo;
    }

    public isSecretario() {
        const item = this.contextList.itens().find(i => i.key === AppCoreKeys.USUARIO_SECRETARIO_MEDICOS);
        return !!item && !!item.value && !!item.value.length;
    }


    public isAuthenticated() {
        const item = this.contextList.itens().find(i => i.key === AppCoreKeys.ACCESS_TOKEN);
        return !!item && !!item.value;
    }

    public getDiasSemana() {
        return [
            "Domingo",
            "Segunda",
            "Terça",
            "Quarta",
            "Quinta",
            "Sexta",
            "Sábado",
        ];
    }

}

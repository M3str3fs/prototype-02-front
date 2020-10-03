import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiBaseService } from './api-base.service';
import { of } from 'rxjs';
import { __prontuarios } from '../model/common.mock';

@Injectable({
    providedIn: 'root',
})
export class ApiProntuarioService extends ApiBaseService {

    constructor(
        private httpClient: HttpClient
    ) {
        super();
    }

    public getAll(idUsuario: string) {
        return this.buildApiPaginacaoRequest((page, length) => {
            return of(__prontuarios).toPromise();
        });
    }

    public getAllHistoricos(idProntuario: string) {
        return of(__prontuarios.find(X => X.id === idProntuario).historicos).toPromise();
    }

}
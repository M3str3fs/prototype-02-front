import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { DominioModel } from 'src/model/dominio.model';
import { ApiBaseService, PaginacaoResponse } from './api-base.service';

@Injectable({
  providedIn: 'root',
})
export class ApiDominioService extends ApiBaseService {

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  public get(ids: string[] = [], grupos: string[] = []) {
    return this.httpClient.get<DominioModel[]>(`${process.env.PREFIX_BACK}/dominio`, {
      params: {
        ids: ids.join(','),
        grupos: grupos.join(','),
      }
    }).toPromise();
  }

  public getPagedQuery(
    grupos: string[] = undefined,
    valor: string = undefined
  ) {
    return this.buildApiPaginacaoRequest((pLimit, pNumber) => {
      return this.httpClient.get<PaginacaoResponse<DominioModel[]>>(`${process.env.PREFIX_BACK}/dominio/paged-query`, {
        params: {
          grupos: grupos.join(','),
          valor: valor,
          pLimit: pLimit.toString(),
          pNumber: pNumber.toString()
        }
      }).toPromise();
    });
  }

}
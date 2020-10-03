import { Component, OnInit } from '@angular/core';
import { UiDataFilterStandardOption } from '../../ui-core/ui-data-filter.interface';
import { AppCoreService } from '../../../services/app-core.service';
import { ApiUsuarioService } from 'src/services/api-usuario.service';
import { UsuarioModel } from 'src/model/usuario.model';
import { DominioModel } from 'src/model/dominio.model';
import { PaginacaoResponse } from 'src/services/api-base.service';
import { UsuarioDadosMedicosModel } from 'src/model/usuario-dados-medicos.model';
import { ApiDominioService } from 'src/services/api-dominio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { buildUiDataFilterStandardOptionsFromDominios } from '../../../util/ui-data-filter.util';
import { UsuarioPerfilMedicoRoute } from 'src/app/app-routing.route';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'busca-medicos-component',
    templateUrl: './busca-medicos.component.html',
    styleUrls: ['./busca-medicos.component.scss']
})
export class BuscaMedicosComponent implements OnInit {

    public oEspecializacoesMedicas: UiDataFilterStandardOption[];
    public oConvenios: UiDataFilterStandardOption[];

    public query: string;
    public pUsuarios: PaginacaoResponse<UsuarioModel>;
    public usuariosDadosMedicos: UsuarioDadosMedicosModel[];
    public dominios: DominioModel[];

    constructor(
        private appCoreService: AppCoreService,
        private apiUsuarioService: ApiUsuarioService,
        private apiDominioService: ApiDominioService,
        private activatedRoute: ActivatedRoute,
        private toastrService: ToastrService,
        private router: Router
    ) {

    }

    public ngOnInit() {
        this.appCoreService.setLoading(this.ngOnInit);
        this.apiDominioService.get(undefined, ['especializacao-medica', 'convenio'])
            .then((r) => {
                this.dominios = r;
                this.oEspecializacoesMedicas = buildUiDataFilterStandardOptionsFromDominios(this.getDominiosEspecializacao());
                this.oConvenios = buildUiDataFilterStandardOptionsFromDominios(this.getDominiosConvenios());
            })
            .then(() => this.activatedRoute.queryParams
                .subscribe((params) => {
                    if (params['query']) {
                        this.query = params['query'];
                        this.doBuscarMedicos(this.query, 1, this.getEspecializacoesSelecionadas(), this.getConveniosSelecionados());
                    }
                }))
            .catch(() => this.toastrService.error('Falha na Aplicação, por gentileza entrar em contato com o suporte responsável.', 'Inicialização'))
            .finally(() => this.appCoreService.setLoaded(this.ngOnInit));
    }

    public doGoUsuarioMeuPerfilMedico(crm: string) {
        this.router.navigate([UsuarioPerfilMedicoRoute.path, crm]);
    }

    public onFilterChanged() {
        this.doBuscarMedicos(this.query, 1, this.getEspecializacoesSelecionadas(), this.getConveniosSelecionados());
    }

    public doBuscarMedicos(query: string, page: number, dominios: string[], convenios: string[]) {
        this.appCoreService.setLoading(this.doBuscarMedicos);
        return this.apiUsuarioService.queryPagedMedico(query, dominios, convenios)
            .page(page, 10)
            .then((r) => this.pUsuarios = r)
            .then((r) => this.apiUsuarioService.queryUsuarioDadosMedicos(undefined, this.pUsuarios.docs.map((x) => x._id)))
            .then((r) => this.usuariosDadosMedicos = r)
            .finally(() => this.appCoreService.setLoaded(this.doBuscarMedicos));
    }

    public isLoading() {
        return this.appCoreService.isLoading();
    }

    public getUsuarioDadosMedicos(idUsuario: string) {
        return this.usuariosDadosMedicos.find((uDadosMedicos) => uDadosMedicos.idUsuario === idUsuario);
    }

    public getEspecializacoesSelecionadas() {
        return (this.oEspecializacoesMedicas || []).filter((o) => o.checked).map((o) => o.value);
    }

    public getConveniosSelecionados() {
        return (this.oConvenios || []).filter((o) => o.checked).map((o) => o.value);
    }

    public getDominio(id: string) {
        return this.dominios.find((especializacao) => especializacao._id === id);
    }

    public getDominiosEspecializacao() {
        return this.dominios.filter((d) => d.grupo === 'especializacao-medica');
    }

    public getDominiosConvenios() {
        return this.dominios.filter((d) => d.grupo === 'convenio');
    }

}

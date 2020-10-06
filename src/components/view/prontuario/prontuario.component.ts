import { Component, OnInit } from '@angular/core';
import { __prontuarios, __usuarios } from '../../../model/common.mock';
import { AppCoreService } from 'src/services/app-core.service';
import { ApiDominioService } from 'src/services/api-dominio.service';
import { ApiUsuarioService } from 'src/services/api-usuario.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioDadosMedicosConsultaModel, UsuarioDadosMedicosProntuarioModel, UsuarioDadosMedicosProntuarioPrescricaoModel } from 'src/model/usuario-dados-medicos.model';
import { UsuarioModel } from 'src/model/usuario.model';
import * as moment from 'moment';
import { DominioModel } from 'src/model/dominio.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
    selector: 'prontuario-component',
    templateUrl: './prontuario.component.html',
    styleUrls: ['./prontuario.component.scss']
})
export class ProntuarioComponent implements OnInit {

    public prontuarios: UsuarioDadosMedicosProntuarioModel[] = [];
    public consultas: UsuarioDadosMedicosConsultaModel[] = [];
    public medicos: UsuarioModel[] = [];
    public dominios:DominioModel[] = [];


    constructor(
        private appCoreService: AppCoreService,
        private apiDominioService: ApiDominioService,
        private apiUsuarioService: ApiUsuarioService,
        // private apiProntuarioService: ApiProntuarioService,
        // private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params['paciente']) {
                this.doLoadProntuario(params['paciente'])
                    .then(() =>
                        Promise.all([
                            this.doLoadProntuarioConsultas(this.prontuarios.map((p) => p.idConsulta)),
                            this.doLoadProntuarioMedicos(this.prontuarios.map((p) => p.idUsuarioMedico)),
                            this.doLoadProntuarioDominios(this.unionProntuarioDominios(this.prontuarios))
                        ])
                    );
            }
        });
    }

    public ngOnInit() {

    }

    public doLoadProntuario(paciente: string) {
        return this.apiUsuarioService.queryUsuarioDadosMedicosProntuario(undefined, undefined, paciente, undefined)
            .then((r) => this.prontuarios = r);
    }

    public doLoadProntuarioConsultas(ids: string[]) {
        return this.apiUsuarioService.queryUsuarioDadosMedicosConsulta(ids, undefined, undefined, undefined)
            .then((r) => this.consultas = r);
    }

    public doLoadProntuarioMedicos(ids: string[]) {
        return this.apiUsuarioService.query(ids)
            .then((r) => this.medicos = r);
    }

    public doLoadProntuarioDominios(ids: string[]) {
        return this.apiDominioService.get(ids)
            .then((r) => this.dominios = r);
    }

    public unionProntuarioDominios(prontuarios: UsuarioDadosMedicosProntuarioModel[]) {
        let ids = [];
        const idsDoenca = prontuarios.map(x => x.diagnostico.map(x => x.doenca));
        const idsMedicamento = prontuarios.map(x => x.prescricoes.map(x => x.medicamento));
        ids = [...ids, ...idsDoenca.reduce((i, c) => i.concat(c), [])];
        ids = [...ids, ...idsMedicamento.reduce((i, c) => i.concat(c), [])];
        return [...new Set(ids)];
    }

    public getConsulta(id: string) {
        return this.consultas.find((c) => c._id === id);
    }

    public getMedico(id: string) {
        return this.medicos.find((c) => c._id === id);
    }

    public getDominio(id: string) {
        return this.dominios.find((c) => c._id === id);
    }

    public getDateScreenFormat(alvo: string) {
        return moment(alvo).format('DD/MM/YYYY HH:mm');
    }

}

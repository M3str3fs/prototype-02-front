import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DominioModel } from '../../../model/dominio.model';
import { UsuarioDadosMedicosConsultaModel, UsuarioDadosMedicosProntuarioDiagnosticoModel, UsuarioDadosMedicosProntuarioModel, UsuarioDadosMedicosProntuarioPrescricaoModel, UsuarioDadosMedicosProntuarioQueixaModel } from 'src/model/usuario-dados-medicos.model';
import { ApiDominioService } from '../../../services/api-dominio.service';
import { ApiUsuarioService } from '../../../services/api-usuario.service';
import { AppCoreService } from '../../../services/app-core.service';
import { UiDataList } from '../../../util/ui-data-list.util';

@Component({
    selector: 'formulario-prontuario-component',
    templateUrl: './formulario-prontuario.component.html',
    styleUrls: ['./formulario-prontuario.component.scss']
})
export class FormularioProntuarioComponent implements OnInit {



    public consulta: UsuarioDadosMedicosConsultaModel;
    public prontuario: UsuarioDadosMedicosProntuarioModel;

    public dominios: DominioModel[] = [];
    public queixa: UiDataList<UsuarioDadosMedicosProntuarioQueixaModel> = new UiDataList();
    public prescricoes: UiDataList<UsuarioDadosMedicosProntuarioPrescricaoModel> = new UiDataList();
    public diagnostico: UiDataList<UsuarioDadosMedicosProntuarioDiagnosticoModel> = new UiDataList();
    public observacao: string;

    public sintoma: string;
    public sintomaInicio: string;

    public doenca: DominioModel;

    public medicamento: DominioModel;
    public medicamentoDosagem: string;
    public medicamentoDuracao: string;
    public medicamentoFrequencia: string;

    constructor(
        private appCoreService: AppCoreService,
        private apiDominioService: ApiDominioService,
        private apiUsuarioService: ApiUsuarioService,
        // private apiProntuarioService: ApiProntuarioService,
        // private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {

    }

    public ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params['consulta']) {
                this.doLoad(params['consulta'], params['medico']);
            }
        });
    }

    public doLoad(consulta: string, medico: string) {
        this.appCoreService.setLoading(this.doLoad);
        this.apiUsuarioService
            .queryUsuarioDadosMedicosProntuario(undefined, consulta).then((r) => this.prontuario = r[0])
            .then(() => {
                if (this.prontuario) {
                    return this.doRefreshDominios().then(() => {
                        this.diagnostico = new UiDataList(this.prontuario.diagnostico);
                        this.prescricoes = new UiDataList(this.prontuario.prescricoes);
                        this.queixa = new UiDataList(this.prontuario.queixa);
                    });
                }
                return;
            })
            .then(() => this.apiUsuarioService.queryUsuarioDadosMedicosConsulta([consulta], undefined, undefined, undefined))
            .then((r) => this.consulta = r[0])
            .finally(() => this.appCoreService.setLoaded(this.doLoad));
    }

    public doRefreshDominios() {
        return this.apiDominioService
            .get([...this.prontuario.prescricoes.map(x => x.medicamento), ...this.prontuario.diagnostico.map(x => x.doenca)])
            .then((r) => this.dominios = r)
    }

    public addQueixa(sintoma: string, inicio: string) {
        this.queixa.add({
            data: new Date().toISOString(),
            inicio: inicio,
            sintoma: sintoma
        });
    }

    public addDiagnostico(doenca: DominioModel) {
        this.dominios.push(doenca);
        this.diagnostico.add({
            data: new Date().toISOString(),
            doenca: doenca._id
        });
    }

    public addPrescricao(medicamento: DominioModel, medicamentoDosagem: string, medicamentoFrequencia: string, medicamentoDuracao: string) {
        this.dominios.push(medicamento);
        this.prescricoes.add({
            data: new Date().toISOString(),
            medicamento: medicamento._id,
            medicamentoDosagem: medicamentoDosagem,
            medicamentoDuracao: medicamentoDuracao,
            medicamentoFrequencia: medicamentoFrequencia
        });
    }

    public doSave() {
        return this.prontuario ? this.doUpdate() : this.doCreate();
    }

    public doCreate() {
        const model: UsuarioDadosMedicosProntuarioModel = {
            prescricoes: this.prescricoes.itens(),
            diagnostico: this.diagnostico.itens(),
            queixa: this.queixa.itens(),
            idConsulta: this.consulta._id,
            idUsuarioMedico: this.consulta.idUsuarioMedico,
            idUsuarioPaciente: this.consulta.idUsuarioPaciente,
            observacao: this.observacao,
        } as any as UsuarioDadosMedicosProntuarioModel;
        this.appCoreService.setLoading(this.doSave);
        return this.apiUsuarioService.createUsuarioDadosMedicosProntuario(model)
            .then((r) => this.prontuario = r)
            .finally(() => this.appCoreService.setLoaded(this.doSave));
    }

    public doUpdate() {
        const model: UsuarioDadosMedicosProntuarioModel = {
            ...this.prontuario,
            idConsulta: this.consulta._id,
            idUsuarioMedico: this.consulta.idUsuarioMedico,
            idUsuarioPaciente: this.consulta.idUsuarioPaciente,
            observacao: this.observacao,
        } as any as UsuarioDadosMedicosProntuarioModel;
        this.appCoreService.setLoading(this.doSave);
        return this.apiUsuarioService.updateUsuarioDadosMedicosProntuario(model)
            .then((r) => this.prontuario = r)
            .finally(() => this.appCoreService.setLoaded(this.doSave));
    }

    public getDominioLabel(id: string) {
        return this.dominios.find((d) => d._id === id);
    }

    public getUiDataListQueixaLabel(item: UsuarioDadosMedicosProntuarioQueixaModel) {
        return `${item.sintoma} com Início em ${item.inicio}, informado em : ${item.data}`;
    }

    public getUiDataListDiagnosticoLabel = (item: UsuarioDadosMedicosProntuarioDiagnosticoModel) => {
        return `${this.getDominioLabel(item.doenca).valor} com Início informado em : ${item.data}`;
    }

    public getUiDataListPrescricaoLabel = (item: UsuarioDadosMedicosProntuarioPrescricaoModel) => {
        return `${this.getDominioLabel(item.medicamento).valor}, ${item.medicamentoDosagem}, ${item.medicamentoDuracao}, ${item.medicamentoFrequencia}`;
    }

    public getUiDataSelectDominioQuery(grupo: string) {
        return (text: string) => {
            return this.apiDominioService.getPagedQuery([grupo], text).page(1, 10).then((r) => r.docs);
        }
    }

    public getUiDataSelectDominioLabel(item: DominioModel) {
        return item.valor;
    }

}

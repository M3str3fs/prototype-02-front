import { SimpleChanges } from '@angular/core';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UsuarioDadosMedicosSolicitacaoAgendamentoModel } from '../../../model/usuario-dados-medicos.model';
import { UsuarioModel } from '../../../model/usuario.model';
import { ApiUsuarioService } from '../../../services/api-usuario.service';
import { AppCoreService } from '../../../services/app-core.service';
import * as moment from 'moment';

@Component({
    selector: 'app-cadastro-agendamento-component',
    templateUrl: './app-cadastro-agendamento.component.html',
    styleUrls: ['./app-cadastro-agendamento.component.scss']
})
export class AppCadastroAgendamentoComponent implements OnInit, OnChanges {

    public agendamento: UsuarioDadosMedicosSolicitacaoAgendamentoModel;
    public medico: UsuarioModel;
    public paciente: UsuarioModel;

    @Input('alvo')
    public _alvo: string;

    @Input('agendamento')
    public _agendamento: string;

    @Input('medico')
    public _medico: string;

    @Input('paciente')
    public _paciente: string;

    @Output('on-solicitacao-agendamento-confirmado')
    public _onSolicitacaoAgendamentoConfirmado: EventEmitter<UsuarioDadosMedicosSolicitacaoAgendamentoModel> = new EventEmitter();

    constructor(
        private appCoreService: AppCoreService,
        private apiUsuarioService: ApiUsuarioService,
        private toastrService: ToastrService
    ) {

    }

    public ngOnInit() {
        this.doLoad(this._agendamento, this._medico, this._paciente);
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.doLoad(this._agendamento, this._medico, this._paciente);
    }

    public doLoad(agendamento: string, medico: string, paciente: string) {
        this.appCoreService.setLoading(this.doLoad);
        if (agendamento) {
            return this.doLoadAgendamento(agendamento)
                .finally(() => this.appCoreService.setLoaded(this.doLoad));
        }
        else {
            this.agendamento = {} as UsuarioDadosMedicosSolicitacaoAgendamentoModel;
            return Promise
                .all([
                    this.doLoadMedico(medico),
                    this.doLoadPaciente(paciente),
                ])
                .finally(() => this.appCoreService.setLoaded(this.doLoad));
        }
    }

    public doLoadAgendamento(agendamento: string) {
        this.appCoreService.setLoading(this.doLoadAgendamento);
        return this.apiUsuarioService
            .queryUsuarioDadosMedicosSolicitacaoAgendamento(agendamento, undefined, undefined, undefined)
            .then((r) => {
                this.agendamento = r[0];
                this._alvo = this.agendamento.alvo;
            })
            .then(() => Promise.all([
                this.doLoadMedico(this.agendamento.idUsuarioMedico),
                this.doLoadPaciente(this.agendamento.idUsuarioPaciente)
            ]))
            .finally(() => this.appCoreService.setLoaded(this.doLoadAgendamento));
    }

    public doLoadMedico(medico: string) {
        this.appCoreService.setLoading(this.doLoadMedico);
        return this.apiUsuarioService
            .query([medico])
            .then((r) => this.medico = r[0])
            .finally(() => this.appCoreService.setLoaded(this.doLoadMedico));
    }

    public doLoadPaciente(paciente: string) {
        this.appCoreService.setLoading(this.doLoadPaciente);
        return this.apiUsuarioService
            .query([paciente])
            .then((r) => this.paciente = r[0])
            .finally(() => this.appCoreService.setLoaded(this.doLoadPaciente));
    }

    public doSaveAgendamento() {
        this.appCoreService.setLoading(this.doSaveAgendamento)
        this.agendamento.idUsuarioPaciente = this.paciente._id;
        this.agendamento.idUsuarioMedico = this.medico._id;
        this.agendamento.alvo = this._alvo;
        return this.apiUsuarioService.createUsuarioDadosMedicosSolicitacaoAgendamento(this.agendamento)
            .then((response) => {
                this.agendamento = response;
                this._onSolicitacaoAgendamentoConfirmado.emit(this.agendamento);
            })
            .catch((error) => this.toastrService.error('Falha ao Agendar', 'Agendamento'))
            .finally(() => this.appCoreService.setLoaded(this.doSaveAgendamento));
    }

    public doCloseAgendamento() {
        this._onSolicitacaoAgendamentoConfirmado.emit(undefined);
    }

    public onPacienteConfirmado(paciente: UsuarioModel) {
        this.paciente = paciente;
    }

    public getDateScreenFormat(alvo: string) {
        return moment(alvo).format('DD/MM/YYYY HH:mm');
    }

    public getUiDataSelectUsuarioQuery() {
        return (text: string) => {
            return this.apiUsuarioService.queryPaged(text).page(1, 10).then((r) => r.docs);
        }
    }

    public getUiDataSelectUsuarioLabel(item: UsuarioModel, onField: boolean) {
        if (onField) {
            return item.nome
        } else {
            return `<b>Nome</b>: ${item.nome}<br></br><b>Documento</b>: ${item.documento}<br></br><b>Email</b>:${item.email}<br></br><b>Telefone</b>:${item.telefone}`;
        }
    }

}
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ConsultaRoute } from '../../../app/app-routing.route';
import { UsuarioDadosMedicosConsultaModel, UsuarioDadosMedicosSolicitacaoAgendamentoModel } from '../../../model/usuario-dados-medicos.model';
import { ApiUsuarioService } from '../../../services/api-usuario.service';
import { AppCoreService } from '../../../services/app-core.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-painel-medico-component',
    templateUrl: './app-painel-medico.component.html',
    styleUrls: ['./app-painel-medico.component.scss']
})
export class AppPainelMedicoComponent implements OnInit, OnChanges {

    public agendamentos: UsuarioDadosMedicosSolicitacaoAgendamentoModel[] = [];
    public consultas: UsuarioDadosMedicosConsultaModel[] = [];

    @Input('medico')
    public _medico: string = undefined;

    @Input('alvo')
    public _alvo: string = undefined;

    constructor(
        private appCoreService: AppCoreService,
        private apiUsuarioService: ApiUsuarioService,
        private router: Router
    ) {

    }

    public ngOnInit() {
        this.doLoad();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['_medico'] || changes['_alvo']) {
            this.doLoad();
        }
    }

    public doLoad() {
        this.appCoreService.setLoading(this.doLoad);
        Promise
            .all([
                this.doLoadConsultas(this._medico, this._alvo).catch(() => this.consultas = []),
                this.doLoadAgendamentos(this._medico, this._alvo).catch(() => this.agendamentos = [])
            ])
            .finally(() => this.appCoreService.setLoaded(this.doLoad));
    }

    public doLoadAgendamentos(medico: string, alvo: string) {
        this.appCoreService.setLoading(this.doLoadAgendamentos);
        return this.apiUsuarioService.queryUsuarioDadosMedicosSolicitacaoAgendamento(undefined, medico, moment(alvo).format('YYYY-MM-DD'), moment(alvo).format('YYYY-MM-DD'))
            .then((response) => this.agendamentos = response)
            .finally(() => this.appCoreService.setLoaded(this.doLoadAgendamentos));
    }

    public doLoadConsultas(medico: string, alvo: string) {
        this.appCoreService.setLoading(this.doLoadConsultas);
        return this.apiUsuarioService.queryUsuarioDadosMedicosConsulta(undefined, medico, moment(alvo).format('YYYY-MM-DD'), moment(alvo).format('YYYY-MM-DD'))
            .then((response) => this.consultas = response)
            .finally(() => this.appCoreService.setLoaded(this.doLoadConsultas));
    }

    public doGoConsultaAgendamento(agendamento: UsuarioDadosMedicosSolicitacaoAgendamentoModel) {
        this.router.navigate([ConsultaRoute.path], {
            queryParams: {
                "medico": agendamento.idUsuarioMedico,
                "paciente": agendamento.idUsuarioPaciente,
                "agendamento": agendamento._id
            }
        });
    }

    public doGoAtualizarConsulta(consulta: UsuarioDadosMedicosConsultaModel) {
        this.router.navigate([ConsultaRoute.path], {
            queryParams: {
                "medico": consulta.idUsuarioMedico,
                "consulta": consulta._id
            }
        });
    }

    public getAgendamentos() {
        return this.agendamentos.filter((a) => !this.getConsultaAgendamento(a._id));
    }

    public getConsultaAgendamento(id: string) {
        return this.consultas.find((i) => i.idAgendamento === id);
    }

    public getAgendamentoConsulta(id: string) {
        return this.agendamentos.find((i) => i._id === id);
    }

    public getDateScreenFormat(alvo: string) {
        return moment(alvo).format('DD/MM/YYYY HH:mm');
    }

}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { UsuarioDadosMedicosConsultaModel, UsuarioDadosMedicosSolicitacaoAgendamentoModel } from 'src/model/usuario-dados-medicos.model';
import { ConsultaRoute } from '../../../app/app-routing.route';
import { UsuarioModel } from '../../../model/usuario.model';
import { ApiProntuarioService } from '../../../services/api-prontuario.service';
import { ApiUsuarioService } from '../../../services/api-usuario.service';
import { AppCoreKeys } from '../../../services/app-core.keys';
import { AppCoreService } from '../../../services/app-core.service';

@Component({
    selector: 'home-medico-component',
    templateUrl: './home-medico.component.html',
    styleUrls: ['./home-medico.component.scss']
})
export class HomeMedicoComponent implements OnInit {

    // public query: string;
    public medico: UsuarioModel;
    public alvo: string;
    // public agendamentos: UsuarioDadosMedicosSolicitacaoAgendamentoModel[] = [];
    // public consultas: UsuarioDadosMedicosConsultaModel[] = [];


    constructor(
        private appCoreService: AppCoreService,
        private apiUsuarioService: ApiUsuarioService,
        private apiProntuarioService: ApiProntuarioService,
        private router: Router
    ) {

    }

    public ngOnInit() {
        this.appCoreService.setLoading(this.ngOnInit);
        this.medico = this.appCoreService.get<UsuarioModel>(AppCoreKeys.USUARIO);
        this.alvo = new Date().toISOString();
        // Promise.all([
        //     this.doLoadConsultas(),
        //     this.doLoadAgendamentos()
        // ])
        //     .finally(() => this.appCoreService.setLoaded(this.ngOnInit));
        this.appCoreService.setLoaded(this.ngOnInit);
    }

    // public doLoadAgendamentos() {
    //     this.appCoreService.setLoading(this.doLoadAgendamentos)
    //     return this.apiUsuarioService.queryUsuarioDadosMedicosSolicitacaoAgendamento(undefined, this.usuario._id, moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'))
    //         .then((response) => this.agendamentos = response)
    //         .finally(() => this.appCoreService.setLoaded(this.doLoadAgendamentos));
    // }

    // public doLoadConsultas() {
    //     this.appCoreService.setLoading(this.doLoadConsultas)
    //     return this.apiUsuarioService.queryUsuarioDadosMedicosConsulta(undefined, this.usuario._id, moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'))
    //         .then((response) => this.consultas = response)
    //         .finally(() => this.appCoreService.setLoaded(this.doLoadConsultas));
    // }

    // public doGoConsultaAgendamento(agendamento: UsuarioDadosMedicosSolicitacaoAgendamentoModel) {
    //     this.router.navigate([ConsultaRoute.path], {
    //         queryParams: {
    //             "medico": agendamento.idUsuarioMedico,
    //             "paciente": agendamento.idUsuarioPaciente,
    //             "agendamento": agendamento._id
    //         }
    //     });
    // }

    // public doGoAtualizarConsulta(consulta: UsuarioDadosMedicosConsultaModel) {
    //     this.router.navigate([ConsultaRoute.path], {
    //         queryParams: {
    //             "medico": consulta.idUsuarioMedico,
    //             "consulta": consulta._id
    //         }
    //     });
    // }

    // public getAgendamentos() {
    //     return this.agendamentos.filter((a) => !this.getConsultaAgendamento(a._id));
    // }

    // public getAlvoAsScreenDate(alvo: string) {
    //     return moment(alvo).format('DD/MM/YYYY HH:mm');
    // }

    // public getConsultaAgendamento(id: string) {
    //     return this.consultas.find((i) => i.idAgendamento === id);
    // }

    // public getAgendamentoConsulta(id: string) {
    //     return this.agendamentos.find((i) => i._id === id);
    // }

}

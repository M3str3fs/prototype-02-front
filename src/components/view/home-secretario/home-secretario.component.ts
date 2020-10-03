import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { UsuarioDadosMedicosSolicitacaoAgendamentoModel } from 'src/model/usuario-dados-medicos.model';
import { ApiUsuarioService } from '../../..//services/api-usuario.service';
import { AgendamentoRoute, BuscaMedicosRoute, ConsultaRoute } from '../../../app/app-routing.route';
import { UsuarioModel } from '../../../model/usuario.model';
import { ApiProntuarioService } from '../../../services/api-prontuario.service';
import { AppCoreKeys } from '../../../services/app-core.keys';
import { AppCoreService } from '../../../services/app-core.service';
import { merge } from '../../../util/ui-array.util';

@Component({
    selector: 'home-secretario-component',
    templateUrl: './home-secretario.component.html',
    styleUrls: ['./home-secretario.component.scss']
})
export class HomeSecretarioComponent implements OnInit {

    public query: string;
    public secretariado: UsuarioModel[] = [];
    public agendamentos: UsuarioDadosMedicosSolicitacaoAgendamentoModel[] = [];

    constructor(
        private appCoreService: AppCoreService,
        private apiUsuarioService: ApiUsuarioService,
        private apiProntuarioService: ApiProntuarioService,
        private router: Router
    ) {

    }

    public ngOnInit() {
        this.secretariado = this.appCoreService.get<UsuarioModel[]>(AppCoreKeys.USUARIO_SECRETARIO_MEDICOS);
        Promise.all(
            this.secretariado.map((s) => this.apiUsuarioService.queryUsuarioDadosMedicosSolicitacaoAgendamento(undefined, s._id, moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')))
        )
            .then((items) => {
                this.agendamentos = merge<UsuarioDadosMedicosSolicitacaoAgendamentoModel>(items);
            });
    }

    public doGoConsultaMedico(medico: UsuarioModel) {
        this.router.navigate([ConsultaRoute.path], {
            queryParams: {
                "medico": medico._id
            }
        });
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

    public doGoAgenda(medico: UsuarioModel) {
        this.router.navigate([AgendamentoRoute.path], {
            queryParams: {
                "medico": medico._id
            }
        });
    }

    public doGoBuscaMedicos(query: string) {
        this.router.navigate([BuscaMedicosRoute.path], {
            queryParams: {
                "query": query
            }
        });
    }

    public getAgendamentos(id: string) {
        return this.agendamentos.filter((i) => i.idUsuarioMedico === id);
    }

    public getAlvoAsScreenDate(alvo: string) {
        return moment(alvo).format('DD/MM/YYYY HH:mm');
    }

}

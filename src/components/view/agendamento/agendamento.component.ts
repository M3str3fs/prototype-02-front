import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { UsuarioDadosMedicosHorarioAtendimentoModel, UsuarioDadosMedicosSolicitacaoAgendamentoModel } from 'src/model/usuario-dados-medicos.model';
import { UsuarioModel } from 'src/model/usuario.model';
import { ApiUsuarioService } from 'src/services/api-usuario.service';
import { AppCoreService } from 'src/services/app-core.service';
import { sort_alpha } from 'src/util/ui-array.util';
import { UiModal } from '../../ui-core/ui-modal';

@Component({
    selector: 'agendamento-component',
    templateUrl: './agendamento.component.html',
    styleUrls: ['./agendamento.component.scss']
})
export class AgendamentoComponent implements OnInit {


    public dias: string[] = this.appCoreService.getDiasSemana();

    public horarios: UsuarioDadosMedicosHorarioAtendimentoModel[] = [];
    public agendamentos: UsuarioDadosMedicosSolicitacaoAgendamentoModel[];
    public agendamento: UsuarioDadosMedicosSolicitacaoAgendamentoModel;
    public medico: UsuarioModel;
    public paciente: UsuarioModel;

    public dateRangeStart: string;
    public dateRangeEnd: string;

    public mdAgendamento: UiModal;

    constructor(
        private appCoreService: AppCoreService,
        private activatedRoute: ActivatedRoute,
        private apiUsuarioService: ApiUsuarioService,
        private toastrService: ToastrService,
        private router: Router
    ) {

    }

    public ngOnInit() {
        this.mdAgendamento = new UiModal(document.querySelector('#md-agendamento'));
        this.dateRangeStart = moment().format('YYYY-MM-DD');
        this.dateRangeEnd = moment().add(6, 'days').format('YYYY-MM-DD');
        this.activatedRoute.queryParams.subscribe((params) => this.doLoad(params['medico']));
    }

    public doLoad(medico: string) {
        this.appCoreService.setLoading(this.doLoad);
        this.apiUsuarioService.query([medico]).then((r) => this.medico = r[0])
            .then(() => this.doLoadHorariosAtendimento())
            .then(() => this.doLoadAgendamentos())
            .finally(() => this.appCoreService.setLoaded(this.doLoad));
    }

    public doLoadHorariosAtendimento() {
        this.appCoreService.setLoading(this.doLoadHorariosAtendimento);
        return this.apiUsuarioService.queryUsuarioDadosMedicosHorarioAtendimento(this.medico._id)
            .then((response) => this.horarios = response)
            .finally(() => this.appCoreService.setLoaded(this.doLoadHorariosAtendimento));
    }

    public doLoadAgendamentos() {
        this.appCoreService.setLoading(this.doLoadAgendamentos)
        return this.apiUsuarioService.queryUsuarioDadosMedicosSolicitacaoAgendamento(undefined, this.medico._id, this.dateRangeStart, this.dateRangeEnd)
            .then((response) => this.agendamentos = response)
            .finally(() => this.appCoreService.setLoaded(this.doLoadAgendamentos));
    }

    public doIncreaseDay() {
        this.dateRangeStart = moment(this.dateRangeStart).add(1, 'day').format('YYYY-MM-DD');
        this.doLoadAgendamentos();
    }

    public doDecreaseDay() {
        this.dateRangeStart = moment(this.dateRangeStart).add(-1, 'day').format('YYYY-MM-DD');
        this.doLoadAgendamentos();
    }

    public doOpenAgendamento(date: string, horarioAtendimento: UsuarioDadosMedicosHorarioAtendimentoModel) {
        const alvo = moment(date)
            .set('hours', parseInt(horarioAtendimento.inicio.split(":")[0]))
            .set('minutes', parseInt(horarioAtendimento.inicio.split(":")[1]));
        const agendamento: Partial<UsuarioDadosMedicosSolicitacaoAgendamentoModel> = {
            idUsuarioMedico: horarioAtendimento.idUsuario,
            alvo: alvo.toISOString(),
        };
        this.agendamento = agendamento as UsuarioDadosMedicosSolicitacaoAgendamentoModel;
        this.mdAgendamento.show();
    }

    public doOpenAgendamentoCadastrado(agendamento:UsuarioDadosMedicosSolicitacaoAgendamentoModel) {
        this.agendamento = agendamento;
        this.mdAgendamento.show();
    }

    public doCloseAgendamento() {
        this.agendamento = undefined;
        this.paciente = undefined;
        this.mdAgendamento.hide();
    }

    public onSolicitacaoAgendamentoConfirmado(agendamento: UsuarioDadosMedicosSolicitacaoAgendamentoModel) {
        if (agendamento) {
            this.agendamentos.push(agendamento);
        }
        this.doCloseAgendamento();
    }

    public onDateStartChange(dateRangeStart: string) {
        this.dateRangeEnd = moment(this.dateRangeStart).add(6, 'd').format('YYYY-MM-DD');
    }

    public getDataExibicao(data: Date) {
        return moment(data).format('DD/MM/YYYY');
    }

    public getDiaSemana(data: Date) {
        return data.getDay();
    }

    public getAgendamento(date: string, horarioAtendimento: UsuarioDadosMedicosHorarioAtendimentoModel) {
        const agendamentos = this.agendamentos || [];
        const alvo = moment(date)
            .set('hours', parseInt(horarioAtendimento.inicio.split(":")[0]))
            .set('minutes', parseInt(horarioAtendimento.inicio.split(":")[1]));
        return agendamentos.find((i) => moment(i.alvo).format('DD/MM/YYYY HH:mm') === alvo.format('DD/MM/YYYY HH:mm'));
    }

    public getHorarios(dia: string) {
        if (dia !== undefined) {
            return this.horarios
                .filter((h) => h.diaSemana === dia.toString())
                .sort(sort_alpha<UsuarioDadosMedicosHorarioAtendimentoModel>((a, b) => {
                    return { a: a.inicio, b: b.inicio };
                }));
        }
        else {
            return [];
        }
    }

    public getDates() {
        const dataFimExibicao = moment(this.dateRangeEnd)
        const data = moment(this.dateRangeStart);
        const datas = [];
        datas.push(moment(data.toDate()).toDate());
        while (this.getDataExibicao(data.toDate()) !== this.getDataExibicao(dataFimExibicao.toDate())) {
            data.add(1, 'd');
            datas.push(moment(data.toDate()).toDate());
        }
        return datas;
    }

}
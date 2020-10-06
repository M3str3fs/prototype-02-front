import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConsultaRoute, ProntuarioFormularioRoute, ProntuarioRoute } from 'src/app/app-routing.route';
import { UsuarioDadosMedicosConsultaModel, UsuarioDadosMedicosSolicitacaoAgendamentoModel } from 'src/model/usuario-dados-medicos.model';
import { ApiUsuarioService } from 'src/services/api-usuario.service';
import { DominioModel } from '../../../model/dominio.model';
import { UsuarioModel } from '../../../model/usuario.model';
import { ApiDominioService } from '../../../services/api-dominio.service';
import { AppCoreService } from '../../../services/app-core.service';

@Component({
    selector: 'consulta-component',
    templateUrl: './consulta.component.html',
    styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {

    public query: string;
    public paciente: UsuarioModel;
    public medico: UsuarioModel;
    public convenio: DominioModel;
    public convenioComplemento: string;
    public convenioIdentificacao: string;
    public agendamento: UsuarioDadosMedicosSolicitacaoAgendamentoModel;
    public consulta: UsuarioDadosMedicosConsultaModel;

    constructor(
        private appCoreService: AppCoreService,
        private activatedRoute: ActivatedRoute,
        private apiUsuarioService: ApiUsuarioService,
        private apiDominioService: ApiDominioService,
        private toastrService: ToastrService,
        private router: Router
    ) {

    }

    public ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params['consulta']) {
                this.doLoadConsultaExistente(params['consulta']);
            }
            else {
                this.doLoadConsultaNova(params['agendamento'], params['medico'], params['paciente']);
            }
        });
    }

    public doLoadConsultaNova(agendamento: string, medico: string, paciente: string) {
        this.appCoreService.setLoading(this.doLoadConsultaNova);
        Promise
            .all([
                this.apiUsuarioService.queryUsuarioDadosMedicosSolicitacaoAgendamento(agendamento, undefined, undefined, undefined).then((r) => this.agendamento = r[0]),
                this.apiUsuarioService.query([medico]).then((r) => this.medico = r[0]),
                this.apiUsuarioService.query(paciente ? [paciente] : []).then((r) => this.paciente = r[0])
            ])
            .then((r) => {
                this.medico = this.medico || {} as UsuarioModel;
                this.paciente = this.paciente;
            })
            .finally(() => this.appCoreService.setLoaded(this.doLoadConsultaNova));
    }


    public doLoadConsultaExistente(consulta: string) {
        this.appCoreService.setLoading(this.doLoadConsultaExistente);
        this.apiUsuarioService.queryUsuarioDadosMedicosConsulta([consulta], undefined, undefined, undefined).then((r) => this.consulta = r[0])
            .then(() =>
                Promise.all([
                    this.apiUsuarioService.query([this.consulta.idUsuarioMedico]).then((r) => this.medico = r[0]),
                    this.apiUsuarioService.query([this.consulta.idUsuarioPaciente]).then((r) => this.paciente = r[0]),
                    this.apiDominioService.get([this.consulta.convenio]).then((r) => this.convenio = r[0])
                ])
            )
            .then(() => {
                this.convenioComplemento = this.consulta.convenioComplemento;
                this.convenioIdentificacao = this.consulta.convenioIdentificacao;
            })
            .finally(() => this.appCoreService.setLoaded(this.doLoadConsultaExistente));
    }

    public onPacienteConfirmado(paciente: UsuarioModel) {
        this.paciente = paciente;
    }

    public doGoProntuarioConsulta(consulta: UsuarioDadosMedicosConsultaModel) {
        this.router.navigate([ProntuarioFormularioRoute.path], {
            queryParams: {
                'consulta': consulta._id,
                'medico': consulta.idUsuarioMedico
            }
        });
    }

    public doGoProntuarioGeral(paciente: UsuarioModel) {
        this.router.navigate([ProntuarioRoute.path], {
            queryParams: {
                'paciente': paciente._id,
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

    public doSalvar() {
        if (this.consulta) {
            return this.doAtualizar();
        } else {
            return this.doCadastrar();
        }
    }

    public doAtualizar() {
        this.appCoreService.setLoading(this.doAtualizar)
        this.consulta.convenio = this.convenio._id;
        this.consulta.convenioComplemento = this.convenioComplemento;
        this.consulta.convenioIdentificacao = this.convenioIdentificacao;
        return this.apiUsuarioService.updateUsuarioDadosMedicosConsulta(this.consulta)
            .finally(() => this.appCoreService.setLoaded(this.doAtualizar));
    }

    public doCadastrar() {
        this.appCoreService.setLoading(this.doSalvar);
        const consulta: UsuarioDadosMedicosConsultaModel = {
            idUsuarioPaciente: this.paciente._id,
            idUsuarioMedico: this.medico._id,
            idAgendamento: this.agendamento ? this.agendamento._id : undefined,
            data: new Date(),
            convenio: this.convenio._id,
            convenioComplemento: this.convenioComplemento,
            convenioIdentificacao: this.convenioIdentificacao,
            valor: undefined
        } as any as UsuarioDadosMedicosConsultaModel;
        return this.apiUsuarioService.createUsuarioDadosMedicosConsulta(consulta)
            .then((r) => this.doGoAtualizarConsulta(r))
            .finally(() => this.appCoreService.setLoaded(this.doSalvar));
    }

    public getUiDataSelectDominioQuery(grupo: string) {
        return (text: string) => {
            return this.apiDominioService.getPagedQuery([grupo], text).page(1, 10).then((r) => r.docs);
        }
    }

    public getUiDataSelectDominioLabel(item: DominioModel) {
        return item.valor;
    }

    public isPacienteApenasLeitura() {
        return !!this.paciente._id;
    }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
        this.activatedRoute.queryParams.subscribe((params) => this.doLoad(params['medico'], params['paciente'], params['agendamento']));
    }

    public doLoad(medico: string, paciente: string, agendamento: string) {
        Promise.all([
            this.apiUsuarioService.queryUsuarioDadosMedicosSolicitacaoAgendamento(agendamento, undefined, undefined, undefined).then((r) => this.agendamento = r[0]),
            this.apiUsuarioService.query([medico]).then((r) => this.medico = r[0]),
            this.apiUsuarioService.query(paciente ? [paciente] : []).then((r) => this.paciente = r[0])
        ]).then((r) => {
            this.medico = this.medico || {} as UsuarioModel;
            this.paciente = this.paciente;
        });
    }

    public onPacienteConfirmado(paciente:UsuarioModel){
        this.paciente = paciente;
    }

    public doSalvar() {
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
        this.appCoreService.setLoading(this.doSalvar)
        this.apiUsuarioService.createUsuarioDadosMedicosConsulta(consulta)
            .finally(() => this.appCoreService.setLoading(this.doSalvar));
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

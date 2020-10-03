import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { UsuarioMeuPerfilMedicoRoute, UsuarioPerfilMedicoRoute } from '../../../app/app-routing.route';
import { UsuarioModel } from '../../../model/usuario.model';
import { AppCoreKeys } from '../../../services/app-core.keys';
import { ApiDominioService } from '../../../services/api-dominio.service';
import { ApiUsuarioService } from '../../../services/api-usuario.service';
import { AppCoreService } from '../../../services/app-core.service';
import { DominioModel } from '../../../model/dominio.model';
import { UiDataList } from '../../../util/ui-data-list.util';
import { UsuarioDadosMedicosHorarioAtendimentoModel, UsuarioDadosMedicosModel } from '../../../model/usuario-dados-medicos.model';
import { sort_alpha } from '../../../util/ui-array.util';

@Component({
    selector: 'usuario-perfil-medico-component',
    templateUrl: './usuario-perfil-medico.component.html',
    styleUrls: ['./usuario-perfil-medico.component.scss']
})
export class UsuarioPerfilMedicoComponent implements OnInit {

    public dominios: DominioModel[] = [];
    public usuario: UsuarioModel;
    public usuadioDadosMedicos: UsuarioDadosMedicosModel;

    public dias: string[] = this.appCoreService.getDiasSemana();

    public updatable: boolean = false;

    public especializacoes: UiDataList<DominioModel> = new UiDataList();
    public convenios: UiDataList<DominioModel> = new UiDataList();
    public telefones: UiDataList<string> = new UiDataList();
    public secretarios: UiDataList<UsuarioModel> = new UiDataList();
    public horarios: UiDataList<UsuarioDadosMedicosHorarioAtendimentoModel> = new UiDataList([], ['inicio', 'fim', 'diaSemana']);

    constructor(
        private appCoreService: AppCoreService,
        private apiDominioService: ApiDominioService,
        private apiUsuarioService: ApiUsuarioService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
        this.usuadioDadosMedicos = {} as UsuarioDadosMedicosModel;
    }

    public ngOnInit() {
        this.activatedRoute.url.subscribe((segments) => this.doHandleUrlSegment(segments));
    }

    public doHandleUrlSegment(segments: UrlSegment[]) {
        this.appCoreService.setLoading(this.ngOnInit);
        return Promise.resolve(segments[0].path)
            .then(async (path) => {
                switch (path) {
                    case (UsuarioMeuPerfilMedicoRoute.path):
                        this.usuario = await this.apiUsuarioService.query([(this.appCoreService.get(AppCoreKeys.USUARIO) as any)._id]).then((response) => response[0]);
                        this.updatable = true;
                        break;
                    case (UsuarioPerfilMedicoRoute.path):
                        this.usuario = await this.apiUsuarioService.queryPagedMedico(segments[1].path)
                            .page(1, 1)
                            .then((response) => response.docs[0]);
                        this.updatable = false;
                        break;
                    default:
                        return;
                }
            })
            .then(() => this.apiUsuarioService.queryUsuarioDadosMedicos(undefined, [this.usuario._id]).then((r) => r[0]))
            .then((response) => this.usuadioDadosMedicos = response)
            .then((response) => {
                if (this.usuadioDadosMedicos) {
                    this.telefones = new UiDataList(response.telefones);
                    return this.doRefreshDominios();
                }
                else {
                    this.usuadioDadosMedicos = {} as UsuarioDadosMedicosModel;
                    this.telefones = new UiDataList();
                    this.especializacoes = new UiDataList();
                    this.convenios = new UiDataList();
                    this.horarios = new UiDataList([], ['inicio', 'fim', 'diaSemana']);
                }
            })
            .then(() => this.apiUsuarioService.queryUsuarioDadosMedicosHorarioAtendimento(this.usuario._id))
            .then((response) => {
                this.horarios = new UiDataList(response, ['inicio', 'fim', 'diaSemana']);
            })
            .finally(() => this.appCoreService.setLoaded(this.ngOnInit));
    }

    public doSalvar(model: UsuarioDadosMedicosModel) {
        model.telefones = this.telefones.itens();
        model.especializacoes = this.especializacoes.itens().map((i) => i._id);
        model.convenios = this.convenios.itens().map((i) => i._id);
        model.secretarios = this.secretarios.itens().map((i) => i._id);

        this.appCoreService.setLoading(this.doSalvar);
        this.apiUsuarioService.updateUsuarioDadosMedicos(model)
            .then((r) => this.apiUsuarioService.updateUsuarioDadosMedicosHorarioAtendimento(this.usuario._id, this.horarios.itens()))
            .finally(() => this.appCoreService.setLoaded(this.doSalvar));
    }

    public doCriar(model: UsuarioDadosMedicosModel) {
        model.idUsuario = this.usuario._id;
        model.telefones = this.telefones.itens();
        model.especializacoes = this.especializacoes.itens().map((i) => i._id);
        model.convenios = this.convenios.itens().map((i) => i._id);
        model.secretarios = this.secretarios.itens().map((i) => i._id);

        this.appCoreService.setLoading(this.doSalvar);
        this.apiUsuarioService.createUsuarioDadosMedicos(model)
            .then((r) => this.apiUsuarioService.updateUsuarioDadosMedicosHorarioAtendimento(this.usuario._id, this.horarios.itens()))
            .finally(() => this.appCoreService.setLoaded(this.doSalvar));
    }

    public doInserirHorario(dia: number, inicio: string, fim: string) {
        this.horarios.add({
            _id: undefined,
            idUsuario: undefined,
            diaSemana: dia.toString(),
            inicio: inicio,
            fim: fim
        });
    }

    public getHorarios(dia: string) {
        if (dia !== undefined) {
            return this.horarios.itens()
                .filter((h) => h.diaSemana === dia.toString())
                .sort(sort_alpha<UsuarioDadosMedicosHorarioAtendimentoModel>((a, b) => {
                    return { a: a.inicio, b: b.inicio };
                }));
        }
        else {
            return [];
        }
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

    public getUiDataSelectDominioQuery(grupo: string) {
        return (text: string) => {
            return this.apiDominioService.getPagedQuery([grupo], text).page(1, 10).then((r) => r.docs);
        }
    }

    public getUiDataSelectDominioLabel(item: DominioModel) {
        return item.valor;
    }

    public doRefreshDominios() {
        return Promise.all([
            this.apiDominioService
                .get(this.usuadioDadosMedicos.especializacoes)
                .then((r) => this.especializacoes = new UiDataList(r)),

            this.apiDominioService
                .get(this.usuadioDadosMedicos.convenios)
                .then((r) => this.convenios = new UiDataList(r)),

            this.apiUsuarioService
                .query(this.usuadioDadosMedicos.secretarios)
                .then((r) => this.secretarios = new UiDataList(r))
        ]);
    }

    public isMedico() {
        return this.appCoreService.isMedico();
    }

    public isMedicoAtivo() {
        return this.appCoreService.isMedico();
    }

}

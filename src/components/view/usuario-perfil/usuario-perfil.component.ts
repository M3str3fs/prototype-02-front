import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { UsuarioMeuPerfilMedicoRoute, UsuarioMeuPerfilRoute, UsuarioPerfilRoute } from 'src/app/app-routing.route';
import { DominioModel } from '../../../model/dominio.model';
import { UsuarioDadosAnamneseHfModel, UsuarioDadosAnamneseHpModel, UsuarioDadosAnamneseHsHvModel } from '../../../model/usuario-dados-anamnese.model';
import { UsuarioModel } from '../../../model/usuario.model';
import { ApiDominioService } from '../../../services/api-dominio.service';
import { ApiProntuarioService } from '../../../services/api-prontuario.service';
import { ApiUsuarioService } from '../../../services/api-usuario.service';
import { AppCoreKeys } from '../../../services/app-core.keys';
import { AppCoreService } from '../../../services/app-core.service';
import { UiDataList } from '../../../util/ui-data-list.util';

@Component({
    selector: 'usuario-perfil-component',
    templateUrl: './usuario-perfil.component.html',
    styleUrls: ['./usuario-perfil.component.scss']
})
export class UsuarioPerfilComponent implements OnInit {

    public dominios: DominioModel[] = [];
    public usuario: UsuarioModel;
    public usuarioDadosAnamneseHp: UsuarioDadosAnamneseHpModel;
    public usuarioDadosAnamneseHf: UsuarioDadosAnamneseHfModel;
    public usuarioDadosAnamneseHsHv: UsuarioDadosAnamneseHsHvModel;

    public queryTest: string = undefined;
    public etapaAnamnese: string = "0";

    public doencasPrevias: UiDataList<DominioModel> = new UiDataList();
    public traumatismos: UiDataList<DominioModel> = new UiDataList();
    public gestacoes: UiDataList = new UiDataList();
    public abortos: UiDataList = new UiDataList();
    public tabagismo: UiDataList = new UiDataList();
    public cirurgiasRealizadas: UiDataList<DominioModel> = new UiDataList();
    public hospitalizacoes: UiDataList = new UiDataList();
    public medicamentosUtilizados: UiDataList<DominioModel> = new UiDataList();
    public medicamentosEmUso: UiDataList<DominioModel> = new UiDataList();
    public toxicosUtilizados: UiDataList = new UiDataList();
    public toxicosEmUso: UiDataList = new UiDataList();
    public fatoresRisco: UiDataList<DominioModel> = new UiDataList();
    public imunizacoes: UiDataList<DominioModel> = new UiDataList();
    public habitosAlimentares: UiDataList = new UiDataList();
    public doencasFamiliares: UiDataList<DominioModel> = new UiDataList();
    public atividadesFisicasDiarias: UiDataList = new UiDataList();
    public escolaridades: UiDataList<DominioModel> = new UiDataList();
    public culturas: UiDataList = new UiDataList();
    public religioes: UiDataList = new UiDataList();
    public condicoesMoradia: UiDataList = new UiDataList();
    public condicoesFinanceiras: UiDataList = new UiDataList();
    public vidaSexual: UiDataList<DominioModel> = new UiDataList();

    constructor(
        private appCoreService: AppCoreService,
        private apiDominioService: ApiDominioService,
        private apiUsuarioService: ApiUsuarioService,
        private apiProntuarioService: ApiProntuarioService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {



    }

    public ngOnInit() {
        this.activatedRoute.url.subscribe((segments) => this.doHandleUrlSegment(segments));
    }

    public doHandleUrlSegment(segments: UrlSegment[]) {
        this.appCoreService.setLoading(this.ngOnInit);
        return Promise.resolve(segments[0].path)
            .then((path) => {
                switch (segments[0].path) {
                    case (UsuarioMeuPerfilRoute.path):
                        this.usuario = this.appCoreService.get(AppCoreKeys.USUARIO) as UsuarioModel;
                        return Promise.resolve([this.appCoreService.get(AppCoreKeys.USUARIO) as UsuarioModel])
                            .then((response) => {
                                this.usuario = response[0];
                            })
                    case (UsuarioPerfilRoute.path):
                    default:
                        return this.apiUsuarioService.query([segments[1].path])
                            .then((response) => {
                                this.usuario = response[0];
                            });
                }
            })
            .then(() => this.apiUsuarioService.oneUsuarioDadosAnamneseHp(undefined, this.usuario._id))
            .then((response) => this.usuarioDadosAnamneseHp = response)
            .then(() => this.apiUsuarioService.oneUsuarioDadosAnamneseHf(undefined, this.usuario._id))
            .then((response) => this.usuarioDadosAnamneseHf = response)
            .then(() => this.apiUsuarioService.oneUsuarioDadosAnamneseHshv(undefined, this.usuario._id))
            .then((response) => this.usuarioDadosAnamneseHsHv = response)
            .then(() => this.apiUsuarioService.oneUsuarioDadosAnamneseHshv(undefined, this.usuario._id))
            .then((response) => {
                this.tabagismo = new UiDataList(this.usuarioDadosAnamneseHp.tabagismo);
                this.gestacoes = new UiDataList(this.usuarioDadosAnamneseHp.gestacoes);
                this.abortos = new UiDataList(this.usuarioDadosAnamneseHp.abortos);
                this.hospitalizacoes = new UiDataList(this.usuarioDadosAnamneseHp.hospitalizacoes);
                this.toxicosUtilizados = new UiDataList(this.usuarioDadosAnamneseHp.toxicosUtilizados);
                this.toxicosEmUso = new UiDataList(this.usuarioDadosAnamneseHp.toxicosEmUso);
                this.habitosAlimentares = new UiDataList(this.usuarioDadosAnamneseHp.habitosAlimentares);

                this.atividadesFisicasDiarias = new UiDataList(this.usuarioDadosAnamneseHsHv.atividadesFisicasDiarias);
                this.condicoesFinanceiras = new UiDataList(this.usuarioDadosAnamneseHsHv.condicoesFinanceiras);
                this.condicoesMoradia = new UiDataList(this.usuarioDadosAnamneseHsHv.condicoesMoradia);
                this.culturas = new UiDataList(this.usuarioDadosAnamneseHsHv.culturas);
                this.religioes = new UiDataList(this.usuarioDadosAnamneseHsHv.religioes);
            })
            .then(() => this.doRefreshDominios())
            .finally(() => this.appCoreService.setLoaded(this.ngOnInit));
    }

    public doGoUsuarioMeuPerfilMedico() {
        this.router.navigate([UsuarioMeuPerfilMedicoRoute.path]);
    }

    public doSalvar(
        usuario: UsuarioModel,
        usuarioDadosAnamneseHp: UsuarioDadosAnamneseHpModel,
        usuarioDadosAnamneseHf: UsuarioDadosAnamneseHfModel,
        usuarioDadosAnamneseHsHv: UsuarioDadosAnamneseHsHvModel,
    ) {

        var _usuario = { ...usuario };

        var _usuarioDadosAnamneseHp = { ...usuarioDadosAnamneseHp };
        _usuarioDadosAnamneseHp.doencasPrevias = this.doencasPrevias.itens().map((i) => i._id);
        _usuarioDadosAnamneseHp.traumatismos = this.traumatismos.itens().map((i) => i._id);
        _usuarioDadosAnamneseHp.tabagismo = this.tabagismo.itens();
        _usuarioDadosAnamneseHp.gestacoes = this.gestacoes.itens();
        _usuarioDadosAnamneseHp.abortos = this.abortos.itens();
        _usuarioDadosAnamneseHp.cirurgiasRealizadas = this.cirurgiasRealizadas.itens().map((i) => i._id);
        _usuarioDadosAnamneseHp.hospitalizacoes = this.hospitalizacoes.itens();
        _usuarioDadosAnamneseHp.medicamentosUtilizados = this.medicamentosUtilizados.itens().map((i) => i._id);
        _usuarioDadosAnamneseHp.medicamentosEmUso = this.medicamentosEmUso.itens().map((i) => i._id);
        _usuarioDadosAnamneseHp.toxicosUtilizados = this.toxicosUtilizados.itens();
        _usuarioDadosAnamneseHp.toxicosEmUso = this.toxicosEmUso.itens();
        _usuarioDadosAnamneseHp.fatoresRisco = this.fatoresRisco.itens().map((i) => i._id)
        _usuarioDadosAnamneseHp.imunizacoes = this.imunizacoes.itens().map((i) => i._id);
        _usuarioDadosAnamneseHp.habitosAlimentares = this.habitosAlimentares.itens();

        var _usuarioDadosAnamneseHf = { ...usuarioDadosAnamneseHf };
        _usuarioDadosAnamneseHf.doencasFamiliares = this.doencasFamiliares.itens().map((i) => i._id);

        var _usuarioDadosAnamneseHshv = { ...usuarioDadosAnamneseHsHv };
        _usuarioDadosAnamneseHshv.atividadesFisicasDiarias = this.atividadesFisicasDiarias.itens();
        _usuarioDadosAnamneseHshv.condicoesFinanceiras = this.condicoesFinanceiras.itens();
        _usuarioDadosAnamneseHshv.condicoesMoradia = this.condicoesMoradia.itens();
        _usuarioDadosAnamneseHshv.culturas = this.culturas.itens();
        _usuarioDadosAnamneseHshv.escolaridades = this.escolaridades.itens().map((i) => i._id);
        _usuarioDadosAnamneseHshv.religioes = this.religioes.itens();
        _usuarioDadosAnamneseHshv.vidaSexual = this.vidaSexual.itens().map((i) => i._id);

        this.appCoreService.setLoading(this.doSalvar);
        Promise
            .all([
                this.apiUsuarioService.put(_usuario),
                this.apiUsuarioService.updateUsuarioDadosAnamneseHp(_usuarioDadosAnamneseHp),
                this.apiUsuarioService.updateUsuarioDadosAnamneseHf(_usuarioDadosAnamneseHf),
                this.apiUsuarioService.updateUsuarioDadosAnamneseHshv(_usuarioDadosAnamneseHshv)
            ])
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

    public doRefreshDominios() {
        return Promise.all([
            this.apiDominioService
                .get(this.usuarioDadosAnamneseHp.doencasPrevias)
                .then((r) => this.doencasPrevias = new UiDataList(r)),

            this.apiDominioService
                .get(this.usuarioDadosAnamneseHp.traumatismos)
                .then((r) => this.traumatismos = new UiDataList(r)),

            this.apiDominioService
                .get(this.usuarioDadosAnamneseHp.cirurgiasRealizadas)
                .then((r) => this.cirurgiasRealizadas = new UiDataList(r)),

            this.apiDominioService
                .get(this.usuarioDadosAnamneseHp.medicamentosUtilizados)
                .then((r) => this.medicamentosUtilizados = new UiDataList(r)),

            this.apiDominioService
                .get(this.usuarioDadosAnamneseHp.medicamentosEmUso)
                .then((r) => this.medicamentosEmUso = new UiDataList(r)),

            this.apiDominioService
                .get(this.usuarioDadosAnamneseHp.fatoresRisco)
                .then((r) => this.fatoresRisco = new UiDataList(r)),

            this.apiDominioService
                .get(this.usuarioDadosAnamneseHp.imunizacoes)
                .then((r) => this.imunizacoes = new UiDataList(r)),

            this.apiDominioService
                .get(this.usuarioDadosAnamneseHf.doencasFamiliares)
                .then((r) => this.doencasFamiliares = new UiDataList(r)),

            this.apiDominioService
                .get(this.usuarioDadosAnamneseHsHv.escolaridades)
                .then((r) => this.escolaridades = new UiDataList(r)),

            this.apiDominioService
                .get(this.usuarioDadosAnamneseHsHv.vidaSexual)
                .then((r) => this.vidaSexual = new UiDataList(r))
        ]);
    }

}

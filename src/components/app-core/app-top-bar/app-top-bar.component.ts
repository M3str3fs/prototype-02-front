import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AgendamentoRoute, BuscaMedicosRoute, ConsultaRoute, HomeRoute, HomeSecretarioRoute, UsuarioMeuPerfilRoute } from 'src/app/app-routing.route';
import { UsuarioModel } from 'src/model/usuario.model';
import { AppCoreKeys } from 'src/services/app-core.keys';
import { AppCoreService } from 'src/services/app-core.service';
import { MenuOpcao } from './menu.interface';

@Component({
    selector: 'app-top-bar-component',
    templateUrl: './app-top-bar.component.html',
    styleUrls: ['./app-top-bar.component.scss']
})
export class AppTopBarComponent implements OnInit {

    constructor(
        private router: Router,
        private appCoreService: AppCoreService
    ) { }

    public ngOnInit() {

    }

    public doGo(opcao: MenuOpcao) {
        this.router.navigate([opcao.path], { queryParams: opcao.queryParams });
    }

    public doGoMeuPerfil() {
        this.router.navigate([UsuarioMeuPerfilRoute.path]);
    }

    public doToggleMobileMenu() {
        document.querySelector('#app-top-bar-navbar-collapse').classList.toggle('show');
    }

    public getUsuario() {
        return this.appCoreService.get<UsuarioModel>(AppCoreKeys.USUARIO) || {} as UsuarioModel;
    }

    public getMenu(): MenuOpcao[] {
        let routes: MenuOpcao[] = [
            // { alias: 'Home', path: HomeRoute.path },
            // { alias: 'Busca de Médicos', path: BuscaMedicosRoute.path },
        ];

        if (this.appCoreService.isMedicoAtivo()) {
            routes = [
                ...routes,
                { alias: 'Home', path: HomeRoute.path },
                { alias: 'Nova Consulta', path: ConsultaRoute.path, queryParams: { medico: this.getUsuario()._id } },
                { alias: 'Minha Agenda', path: AgendamentoRoute.path, queryParams: { medico: this.getUsuario()._id } }
            ]
        }

        if (this.appCoreService.isSecretario()) {
            routes = [
                ...routes,
                { alias: 'Atendimento', path: HomeSecretarioRoute.path }
            ]
        }
        return routes;
    }

}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { AutenticacaoPassportFailureRoute, AutenticacaoPassportSuccessRoute, AutenticacaoRoute, HomeRoute } from '../../../app/app-routing.route';
import { UsuarioModel } from '../../../model/usuario.model';
import { ApiUsuarioService } from '../../../services/api-usuario.service';
import { AppCoreKeys } from '../../../services/app-core.keys';
import { AppCoreService } from '../../../services/app-core.service';

@Component({
    selector: 'autenticacao-component',
    templateUrl: './autenticacao.component.html',
    styleUrls: ['./autenticacao.component.scss']
})
export class AutenticacaoComponent implements OnInit {

    constructor(
        private appCoreService: AppCoreService,
        private apiUsuarioService: ApiUsuarioService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {

    }

    public ngOnInit() {
        this.activatedRoute.url.subscribe((segments) => this.doHandleUrlSegment(segments));
    }

    public doHandleUrlSegment(segments: UrlSegment[]) {
        switch (segments[0].path) {
            case (AutenticacaoPassportSuccessRoute.path):
                this.doAuthenticate(segments[1].path);
                break;
            case (AutenticacaoPassportFailureRoute.path):
                break;
            case (AutenticacaoRoute):
                break;
        }
    }

    public doAuthenticateWithGoogle() {
        window.location.href = `${process.env.PREFIX_BACK}/google`;
    }

    public doAuthenticate(token: string) {
        this.appCoreService.setLoading(this.doAuthenticate);
        this.appCoreService.set(AppCoreKeys.ACCESS_TOKEN, token);
        this.doSetUsuario()
            .then(() => Promise.all([
                this.doSetDadosMedicos(),
                this.doSetSecretarioMedicos()
            ]))
            .then(() => this.router.navigate([HomeRoute.path]))
            .finally(() => this.appCoreService.setLoaded(this.doAuthenticate));

    }

    public doSetUsuario() {
        return new Promise((resolve, reject) => {
            let personificar = window.prompt('Personificar');
            // let personificar = '5f7684184522d4090b510d13';
            if (personificar) {
                this.apiUsuarioService.query([personificar])
                    .then((x) => {
                        this.appCoreService.set(AppCoreKeys.USUARIO, x[0]);
                        resolve();
                    })
            }
            else {
                this.apiUsuarioService.oneAutenticado()
                    .then((x) => {
                        this.appCoreService.set(AppCoreKeys.USUARIO, x);
                        resolve();
                    })
            }
        })

    }

    public doSetDadosMedicos() {
        return this.apiUsuarioService.queryUsuarioDadosMedicos(undefined, [this.appCoreService.get<UsuarioModel>(AppCoreKeys.USUARIO)._id])
            .then((r) => {
                this.appCoreService.set(AppCoreKeys.USUARIO_MEDICO, r[0]);
            });
    }

    public doSetSecretarioMedicos() {
        return this.apiUsuarioService.querySecretarioMedicos(this.appCoreService.get<UsuarioModel>(AppCoreKeys.USUARIO)._id)
            .then((r) => {
                this.appCoreService.set(AppCoreKeys.USUARIO_SECRETARIO_MEDICOS, r);
            });
    }

}

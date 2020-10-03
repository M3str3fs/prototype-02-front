import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AppCoreKeys } from '../services/app-core.keys';
import { AppCoreService } from '../services/app-core.service';
import { UsuarioModel } from '../model/usuario.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class AcessoMedicoGuard implements CanActivate {

    constructor(
        private appCoreService: AppCoreService,
        private toastrService: ToastrService
    ) { }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let alcada = true;
        if (this.appCoreService.isMedico()) {
            const dados = this.appCoreService.get<UsuarioModel>(AppCoreKeys.USUARIO);
            alcada = dados._id === next.queryParams['medico'];
        }
        else if (this.appCoreService.isSecretario()) {
            const secretariado = this.appCoreService.get<UsuarioModel[]>(AppCoreKeys.USUARIO_SECRETARIO_MEDICOS);
            alcada = secretariado.some((i) => i._id === next.queryParams['medico']);
        }

        if (alcada) {
            return true;
        }
        else {
            this.toastrService.error('Você não possúi acesso para esse conteúdo', 'Acesso Negado');
            return false;
        }
    }

}



import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultaRoute, AgendamentoRoute } from 'src/app/app-routing.route';
import { ApiUsuarioService } from '../../..//services/api-usuario.service';
import { UsuarioModel } from '../../../model/usuario.model';
import { ApiProntuarioService } from '../../../services/api-prontuario.service';
import { AppCoreKeys } from '../../../services/app-core.keys';
import { AppCoreService } from '../../../services/app-core.service';

@Component({
    selector: 'home-secretario-component',
    templateUrl: './home-secretario.component.html',
    styleUrls: ['./home-secretario.component.scss']
})
export class HomeSecretarioComponent implements OnInit {

    public secretariado: UsuarioModel[] = [];
    public alvo: string;

    constructor(
        private appCoreService: AppCoreService,
        private router: Router
    ) {

    }

    public ngOnInit() {
        this.appCoreService.setLoading(this.ngOnInit);
        this.secretariado = this.appCoreService.get<UsuarioModel[]>(AppCoreKeys.USUARIO_SECRETARIO_MEDICOS);
        this.alvo = new Date().toISOString();
        this.appCoreService.setLoaded(this.ngOnInit);
    }

    public doGoConsultaMedico(medico: UsuarioModel) {
        this.router.navigate([ConsultaRoute.path], {
            queryParams: {
                "medico": medico._id
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

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/model/usuario.model';
import { ApiUsuarioService } from 'src/services/api-usuario.service';
import { AgendamentoRoute, BuscaMedicosRoute } from '../../../app/app-routing.route';
import { ApiProntuarioService } from '../../../services/api-prontuario.service';
import { AppCoreService } from '../../../services/app-core.service';

@Component({
    selector: 'home-component',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    public query: string;
    public secretariado: UsuarioModel[];

    constructor(
        private appCoreService: AppCoreService,
        private apiUsuarioService: ApiUsuarioService,
        private apiProntuarioService: ApiProntuarioService,
        private router: Router
    ) {

    }

    public ngOnInit() {
        
    }

    public doGoBuscaMedicos(query: string) {
        this.router.navigate([BuscaMedicosRoute.path], {
            queryParams: {
                "query": query
            }
        });
    }


}

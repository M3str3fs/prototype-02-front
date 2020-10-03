import { Component, OnInit } from '@angular/core';
import { __usuarios } from '../../../model/common.mock';
import { UsuarioDadosAnamneseModel } from '../../../model/usuario-dados-anamnese.model';
import { UsuarioModel } from '../../../model/usuario.model';

@Component({
    selector: 'anamnese-component',
    templateUrl: './anamnese.component.html',
    styleUrls: ['./anamnese.component.scss']
})
export class AnamneseComponent implements OnInit {

    public id: string;
    public usuario: UsuarioModel;
    public fichaTecnica: UsuarioDadosAnamneseModel;

    public ngOnInit() {

        this.usuario = __usuarios[0];
        // this.fichaTecnica = __usuarioDadosAnamneses.find(x => x.idUsuario === this.usuario.idUsuarioDadosMedicos);

    }

    public getDoenca(id: string) {
        // return __doencas.find(x => x.id === id);
    }

}

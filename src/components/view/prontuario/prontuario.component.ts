import { Component, OnInit } from '@angular/core';
import { ProntuarioModel } from '../../../model/prontuario.model';
import { __prontuarios, __usuarios } from '../../../model/common.mock';

@Component({
    selector: 'prontuario-component',
    templateUrl: './prontuario.component.html',
    styleUrls: ['./prontuario.component.scss']
})
export class ProntuarioComponent implements OnInit {

    public id: string;
    public prontuario: ProntuarioModel;

    public ngOnInit() {
        this.prontuario = __prontuarios[0];
    }

    public getUsuarioDoutor() {
        return __usuarios.find(x => x._id === this.prontuario.idDoutor);
    }

    public getUsuarioPaciente() {
        return __usuarios.find(x => x._id === this.prontuario.idPaciente);
    }

}

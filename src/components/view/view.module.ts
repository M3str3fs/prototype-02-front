import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiCoreModule } from '../ui-core/ui-core.module';
import { AgendamentoComponent } from './agendamento/agendamento.component';
import { AnamneseComponent } from './anamnese/anamnese.component';
import { AutenticacaoComponent } from './autenticacao/autenticacao.component';
import { BuscaMedicosComponent } from './busca-medicos/busca-medicos.component';
import { HomeSecretarioComponent } from './home-secretario/home-secretario.component';
import { HomeComponent } from './home/home.component';
import { ProntuarioComponent } from './prontuario/prontuario.component';
import { UsuarioPerfilMedicoComponent } from './usuario-perfil-medico/usuario-perfil-medico.component';
import { UsuarioPerfilComponent } from './usuario-perfil/usuario-perfil.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { AppCoreModule } from '../app-core/app-core.module';


@NgModule({
    declarations: [
        ProntuarioComponent,
        AnamneseComponent,
        AutenticacaoComponent,
        HomeComponent,
        HomeSecretarioComponent,
        BuscaMedicosComponent,
        UsuarioPerfilComponent,
        UsuarioPerfilMedicoComponent,
        AgendamentoComponent,
        ConsultaComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        UiCoreModule,
        AppCoreModule
    ],
    exports: []
})
export class ViewModule { }

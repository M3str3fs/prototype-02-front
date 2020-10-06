import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AgendamentoComponent } from '../components/view/agendamento/agendamento.component';
import { AnamneseComponent } from '../components/view/anamnese/anamnese.component';
import { AutenticacaoComponent } from '../components/view/autenticacao/autenticacao.component';
import { BuscaMedicosComponent } from '../components/view/busca-medicos/busca-medicos.component';
import { ConsultaComponent } from '../components/view/consulta/consulta.component';
import { HomeSecretarioComponent } from '../components/view/home-secretario/home-secretario.component';
import { HomeMedicoComponent } from '../components/view/home-medico/home-medico.component';
import { HomeComponent } from '../components/view/home/home.component';
import { ProntuarioComponent } from '../components/view/prontuario/prontuario.component';
import { UsuarioPerfilMedicoComponent } from '../components/view/usuario-perfil-medico/usuario-perfil-medico.component';
import { UsuarioPerfilComponent } from '../components/view/usuario-perfil/usuario-perfil.component';
import { ViewModule } from '../components/view/view.module';
import { AcessoMedicoGuard } from '../guard/acesso-medico.guard';
import { AutenticacaoGuard } from '../guard/autenticacao.guard';
import { HomeGuard } from '../guard/home.guard';
import { NaoAutenticacaoGuard } from '../guard/nao-autenticacao.guard';
import { AgendamentoRoute, AnamneseRoute, AutenticacaoPassportFailureRoute, AutenticacaoPassportSuccessRoute, AutenticacaoRoute, BuscaMedicosRoute, ConsultaRoute, HomeMedicoRoute, HomePacienteRoute, HomeRoute, HomeSecretarioRoute, ProntuarioFormularioRoute, ProntuarioRoute, UsuarioMeuPerfilMedicoRoute, UsuarioMeuPerfilRoute, UsuarioPerfilMedicoRoute, UsuarioPerfilRoute } from './app-routing.route';
import { FormularioProntuarioComponent } from 'src/components/view/formulario-prontuario/formulario-prontuario.component';


@NgModule({
  declarations: [],
  imports: [
    ViewModule,
    RouterModule.forRoot([
      { ...AutenticacaoRoute, component: AutenticacaoComponent, canActivate: [NaoAutenticacaoGuard] },
      { path: `${AutenticacaoPassportSuccessRoute.path}/:token`, component: AutenticacaoComponent, canActivate: [NaoAutenticacaoGuard] },
      { path: `${AutenticacaoPassportFailureRoute.path}/:message`, component: AutenticacaoComponent, canActivate: [NaoAutenticacaoGuard] },

      { ...HomeRoute, component: HomeComponent, canActivate: [AutenticacaoGuard, HomeGuard] },
      { ...HomeSecretarioRoute, component: HomeSecretarioComponent, canActivate: [AutenticacaoGuard] },
      { ...HomeMedicoRoute, component: HomeMedicoComponent, canActivate: [AutenticacaoGuard] },

      { ...ProntuarioRoute, component: ProntuarioComponent, canActivate: [] },
      { ...ProntuarioFormularioRoute, component: FormularioProntuarioComponent, canActivate: [AutenticacaoGuard, AcessoMedicoGuard] },
      { ...AnamneseRoute, component: AnamneseComponent, canActivate: [AutenticacaoGuard] },

      { ...BuscaMedicosRoute, component: BuscaMedicosComponent, canActivate: [AutenticacaoGuard] },

      { ...UsuarioPerfilRoute, component: UsuarioPerfilComponent, canActivate: [] },
      { ...UsuarioMeuPerfilRoute, component: UsuarioPerfilComponent, canActivate: [AutenticacaoGuard] },

      { path: `${UsuarioPerfilMedicoRoute.path}/:id`, component: UsuarioPerfilMedicoComponent, canActivate: [AutenticacaoGuard] },
      { ...UsuarioMeuPerfilMedicoRoute, component: UsuarioPerfilMedicoComponent, canActivate: [AutenticacaoGuard] },

      { ...AgendamentoRoute, component: AgendamentoComponent, canActivate: [AutenticacaoGuard, AcessoMedicoGuard] },
      { ...ConsultaRoute, component: ConsultaComponent, canActivate: [AutenticacaoGuard, AcessoMedicoGuard] },

      { path: '', pathMatch: 'full', redirectTo: `/${AutenticacaoRoute.path}` },
      { path: '**', pathMatch: 'full', redirectTo: `/${HomePacienteRoute.path}` }
    ], { useHash: true, enableTracing: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }

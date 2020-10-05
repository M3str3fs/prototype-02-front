import { Route, RouterModule } from '@angular/router';

export const ProntuarioRoute: Partial<Route> = { path: 'prontuario' };
export const ProntuarioFormularioRoute: Partial<Route> = { path: 'formulario-prontuario' };
export const AnamneseRoute: Partial<Route> = { path: 'anamnese' };
export const AutenticacaoRoute: Partial<Route> = { path: 'autenticacao' };
export const AutenticacaoPassportSuccessRoute: Partial<Route> = { path: 'autenticacao-passport-success' };
export const AutenticacaoPassportFailureRoute: Partial<Route> = { path: 'autenticacao-passport-failure' };
export const HomeRoute: Partial<Route> = { path: 'home' };
export const HomePacienteRoute: Partial<Route> = { path: 'home-paciente' };
export const HomeSecretarioRoute: Partial<Route> = { path: 'home-secretario' };
export const HomeMedicoRoute: Partial<Route> = { path: 'home-medico' };
export const BuscaMedicosRoute: Partial<Route> = { path: 'busca-medicos' };
export const UsuarioPerfilRoute: Partial<Route> = { path: 'usuario-perfil' };
export const UsuarioMeuPerfilRoute: Partial<Route> = { path: 'usuario-meu-perfil' };
export const UsuarioPerfilMedicoRoute: Partial<Route> = { path: 'usuario-perfil-medico' };
export const UsuarioMeuPerfilMedicoRoute: Partial<Route> = { path: 'usuario-meu-perfil-medico' };
export const AgendamentoRoute: Partial<Route> = { path: 'agendamento' };
export const ConsultaRoute: Partial<Route> = { path: 'consulta' };
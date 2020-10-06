import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { UsuarioDadosAnamneseHfModel, UsuarioDadosAnamneseHpModel, UsuarioDadosAnamneseHsHvModel } from '../model/usuario-dados-anamnese.model';
import { UsuarioModel } from '../model/usuario.model';
import { UsuarioDadosMedicosConsultaModel, UsuarioDadosMedicosHorarioAtendimentoModel, UsuarioDadosMedicosModel, UsuarioDadosMedicosProntuarioModel, UsuarioDadosMedicosSolicitacaoAgendamentoModel } from '../model/usuario-dados-medicos.model';
import { __usuarios } from '../model/common.mock';
import { ApiBaseService, PaginacaoResponse } from './api-base.service';

@Injectable({
    providedIn: 'root',
})
export class ApiUsuarioService extends ApiBaseService {

    constructor(
        private httpClient: HttpClient
    ) {
        super();
    }

    public post(model: UsuarioModel) {
        return this.httpClient.post<UsuarioModel>('http://localhost:3000/usuario', model).toPromise();
    }

    public put(model: UsuarioModel) {
        return this.httpClient.put<UsuarioModel>('http://localhost:3000/usuario', model).toPromise();
    }

    public query(ids: string[]) {
        return this.httpClient.get<UsuarioModel[]>('http://localhost:3000/usuario', {
            params: {
                ids: ids.join(',')
            }
        }).toPromise();
    }

    public querySecretarioMedicos(secretario: string) {
        return this.httpClient.get<UsuarioModel[]>('http://localhost:3000/usuario/secretario-medicos', {
            params: {
                secretario: secretario
            }
        }).toPromise();
    }

    public queryPaged(query: string) {
        return this.buildApiPaginacaoRequest((page, limit) => {
            return this.httpClient.get<PaginacaoResponse<UsuarioModel>>('http://localhost:3000/usuario/paged', {
                params: {
                    query: query,
                    page: page.toString(),
                    limit: limit.toString()
                }
            }).toPromise();
        });

    }

    public queryPagedMedico(query: string, especializacoes: string[] = [], convenios: string[] = []) {
        return this.buildApiPaginacaoRequest((page, limit) => {
            return this.httpClient.get<PaginacaoResponse<UsuarioModel>>('http://localhost:3000/usuario/paged-medico', {
                params: this.cleanParams({
                    query: query,
                    especializacoes: especializacoes.join(','),
                    convenios: convenios.join(','),
                    page: page.toString(),
                    limit: limit.toString()
                })
            }).toPromise();
        });

    }

    public oneAutenticado() {
        return this.httpClient.get<UsuarioModel>('http://localhost:3000/usuario/autenticado').toPromise();
    }

    public updateUsuarioDadosAnamneseHp(model: UsuarioDadosAnamneseHpModel) {
        return this.httpClient.put('http://localhost:3000/usuario/dados-anamnese-hp', model).toPromise();
    }

    public oneUsuarioDadosAnamneseHp(id: string, usuario: string) {
        return this.httpClient.get<UsuarioDadosAnamneseHpModel>('http://localhost:3000/usuario/dados-anamnese-hp', {
            params: this.cleanParams({
                id: id,
                usuario: usuario
            })
        }).toPromise();
    }

    public updateUsuarioDadosAnamneseHf(model: UsuarioDadosAnamneseHfModel) {
        return this.httpClient.put('http://localhost:3000/usuario/dados-anamnese-hf', model).toPromise();
    }

    public oneUsuarioDadosAnamneseHf(id: string, usuario: string) {
        return this.httpClient.get<UsuarioDadosAnamneseHfModel>('http://localhost:3000/usuario/dados-anamnese-hf', {
            params: this.cleanParams({
                id: id,
                usuario: usuario
            })
        }).toPromise();
    }

    public updateUsuarioDadosAnamneseHshv(model: UsuarioDadosAnamneseHsHvModel) {
        return this.httpClient.put('http://localhost:3000/usuario/dados-anamnese-hshv', model).toPromise();
    }

    public oneUsuarioDadosAnamneseHshv(id: string, usuario: string) {
        return this.httpClient.get<UsuarioDadosAnamneseHsHvModel>('http://localhost:3000/usuario/dados-anamnese-hshv', {
            params: this.cleanParams({
                id: id,
                usuario: usuario
            })
        }).toPromise();
    }

    public queryUsuarioDadosMedicos(ids: string[] = [], usuarios: string[] = [], query: string = undefined) {
        return this.httpClient.get<UsuarioDadosMedicosModel[]>('http://localhost:3000/usuario/dados-medicos', {
            params: this.cleanParams({
                ids: ids.join(','),
                usuarios: usuarios.join(',')
            })
        }).toPromise();
    }

    public createUsuarioDadosMedicos(model: UsuarioDadosMedicosModel) {
        return this.httpClient.post('http://localhost:3000/usuario/dados-medicos', model).toPromise();
    }

    public updateUsuarioDadosMedicos(model: UsuarioDadosMedicosModel) {
        return this.httpClient.put('http://localhost:3000/usuario/dados-medicos', model).toPromise();
    }

    public queryUsuarioDadosMedicosHorarioAtendimento(medico: string) {
        return this.httpClient.get<UsuarioDadosMedicosHorarioAtendimentoModel[]>('http://localhost:3000/usuario/dados-medicos/horario-atendimento', {
            params: {
                medico: medico
            }
        }).toPromise();
    }

    public updateUsuarioDadosMedicosHorarioAtendimento(medico: string, model: UsuarioDadosMedicosHorarioAtendimentoModel[]) {
        return this.httpClient.put('http://localhost:3000/usuario/dados-medicos/horario-atendimento', model, {
            params: {
                medico: medico
            }
        }).toPromise();
    }

    public createUsuarioDadosMedicosSolicitacaoAgendamento(model: UsuarioDadosMedicosSolicitacaoAgendamentoModel) {
        return this.httpClient.post<UsuarioDadosMedicosSolicitacaoAgendamentoModel>('http://localhost:3000/usuario/dados-medicos/solicitacao-agendamento', model,
            {
                params: {
                    medico: model.idUsuarioMedico
                }
            }).toPromise();
    }

    public queryUsuarioDadosMedicosSolicitacaoAgendamento(id: string, medico: string, alvoDe: string, alvoAte: string) {
        return this.httpClient.get<UsuarioDadosMedicosSolicitacaoAgendamentoModel[]>('http://localhost:3000/usuario/dados-medicos/solicitacao-agendamento', {
            params: this.cleanParams({
                id: id,
                medico: medico,
                alvoDe: alvoDe,
                alvoAte: alvoAte
            })
        }).toPromise();
    }

    public createUsuarioDadosMedicosConsulta(model: UsuarioDadosMedicosConsultaModel) {
        return this.httpClient.post<UsuarioDadosMedicosConsultaModel>('http://localhost:3000/usuario/dados-medicos/consulta', model,
            {
                params: {
                    medico: model.idUsuarioMedico
                }
            }).toPromise();
    }

    public updateUsuarioDadosMedicosConsulta(model: UsuarioDadosMedicosConsultaModel) {
        return this.httpClient.put<UsuarioDadosMedicosConsultaModel>('http://localhost:3000/usuario/dados-medicos/consulta', model,
            {
                params: {
                    medico: model.idUsuarioMedico
                }
            }).toPromise();
    }

    public queryUsuarioDadosMedicosConsulta(ids: string[] = [], medico: string, alvoDe: string, alvoAte: string) {
        return this.httpClient.get<UsuarioDadosMedicosConsultaModel[]>('http://localhost:3000/usuario/dados-medicos/consulta', {
            params: this.cleanParams({
                ids: ids.join(','),
                medico: medico,
                alvoDe: alvoDe,
                alvoAte: alvoAte
            })
        }).toPromise();
    }

    public createUsuarioDadosMedicosProntuario(model: UsuarioDadosMedicosProntuarioModel) {
        return this.httpClient.post<UsuarioDadosMedicosProntuarioModel>('http://localhost:3000/usuario/dados-medicos/prontuario', model,
            {
                params: {
                    medico: model.idUsuarioMedico,
                    paciente: model.idUsuarioPaciente,
                    consulta: model.idConsulta
                }
            }).toPromise();
    }

    public updateUsuarioDadosMedicosProntuario(model: UsuarioDadosMedicosProntuarioModel) {
        return this.httpClient.put<UsuarioDadosMedicosProntuarioModel>('http://localhost:3000/usuario/dados-medicos/prontuario', model,
            {
                params: {
                    medico: model.idUsuarioMedico,
                    paciente: model.idUsuarioPaciente,
                    consulta: model.idConsulta
                }
            }).toPromise();
    }

    public queryUsuarioDadosMedicosProntuario(ids: string[] = [], consulta: string = undefined, paciente: string = undefined, medico: string = undefined,) {
        return this.httpClient.get<UsuarioDadosMedicosProntuarioModel[]>('http://localhost:3000/usuario/dados-medicos/prontuario', {
            params: this.cleanParams({
                ids: ids.join(','),
                consulta: consulta,
                paciente: paciente,
                medico: medico
            })
        }).toPromise();
    }



}
import { UsuarioModel } from './usuario.model';

export interface UsuarioDadosAnamneseModel {
    idUsuario: string;
    idHp: UsuarioDadosAnamneseHpModel;
    idHf: UsuarioDadosAnamneseHfModel;
    idHshv: UsuarioDadosAnamneseHsHvModel;
}

export interface UsuarioDadosAnamneseHpModel {
    _id: string;
    doencasPrevias: string[];
    traumatismos: string[];
    gestacoes: string[];
    abortos: string[];
    tabagismo: string[];
    cirurgiasRealizadas: string[];
    hospitalizacoes: string[];
    medicamentosUtilizados: string[];
    medicamentosEmUso: string[];
    toxicosUtilizados: string[];
    toxicosEmUso: string[];
    fatoresRisco: string[];
    imunizacoes: string[];
    sonoMediaHoras: string[];
    habitosAlimentares: string[];
}

export interface UsuarioDadosAnamneseHfModel {
    _id: string;
    doencasFamiliares: string[];
}

export interface UsuarioDadosAnamneseHsHvModel {
    _id: string;
    localNascimento: string;
    atividadesFisicasDiarias: string[];
    escolaridades: string[];
    culturas: string[];
    religioes: string[];
    condicoesMoradia: string[];
    condicoesFinanceiras: string[];
    vidaSexual: string[];
}
import { UsuarioModel } from './usuario.model';

export interface ProntuarioModel {
    id: string;
    idPaciente: string;
    idDoutor: string;
    titulo: string;
    descricao: string;
    dataInicio: string;
    dataTermino?: string;
    historicos: ProntuarioHistoricoModel[];
}

export interface ProntuarioHistoricoModel {
    idDoutor: string;
    dataLancamento: string;
    type: string;
    description: string;
    idMedicamento?: string;
    idCid?: string;
}

export enum ProntuarioHistoricoType {
    DIAGNOSTICO = 'Diagnóstico',
    EXAME = 'Exame',
    MEDICAMENTO = 'Medicamento'
}
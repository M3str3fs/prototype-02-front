export interface UsuarioDadosMedicosModel {
    _id: string;
    idUsuario: string;
    crm: string;
    secretarios: string[];
    especializacoes: string[];
    convenios: string[];
    telefones: string[];
    emails: string[];
    ativo: boolean;
}

export interface UsuarioDadosMedicosHorarioAtendimentoModel {
    _id: string;
    idUsuario: string;
    diaSemana: string;
    inicio: string;
    fim: string;
}


export interface UsuarioDadosMedicosSolicitacaoAgendamentoModel {
    _id: string;
    idUsuarioPaciente: string;
    idUsuarioMedico: string;
    alvo: string;
    baixa: string;
    observacao: string;
    confirmacao: Boolean;
};

export interface UsuarioDadosMedicosLocalAtendimentoModel {
    _id: string;
    idUsuarioMedico: string;
    numero: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
}

export interface UsuarioDadosMedicosConsultaModel {
    _id: string;
    idAgendamento: string;
    idUsuarioPaciente: string;
    idUsuarioMedico: string;
    data: Date;
    convenio: string;
    convenioComplemento: string;
    convenioIdentificacao: string;
    valor: number;
};

export interface UsuarioDadosMedicosRecomendacaoEspecialidadeModel {
    _id: string;
    idUsuario: string;
    idUsuarioMedico: string;
    especialidade: string;
    avaliacao: string;
    nota: number;
}

export interface UsuarioDadosMedicosRecomendacaoTratamentoModel {
    _id: string;
    idUsuario: string;
    idUsuarioMedico: string;
    idDoenca: string;
    avaliacao: string;
    nota: number;
}
export interface UsuarioModel {
    _id: string;
    nome: string;
    dataNascimento: string;
    documento?: string;
    telefone?: string;
    email?: string;
    sexo?: string;
    estadoCivil?: string;
    cor?: string;
    naturalidade?: string;
    profissao?: string;
}
import { School } from "../ schools/school-interface";
import { IesResponse } from "../ies-unit/ies-unit-Response";

export interface Patient {
    id: number;
    nome: string;
    categoria: 'COLABORADOR_UNIDADE' | 'COLABORADOR_ESCOLA' | 'ALUNO' | 'EXTERNO';
    celular: string;
    email: string;
    dataCadastramento: string;
    motivoRestricao: string;
    status: 'ATIVO' | 'INATIVO';
    escola?: School;
    unidade?: IesResponse;    
}
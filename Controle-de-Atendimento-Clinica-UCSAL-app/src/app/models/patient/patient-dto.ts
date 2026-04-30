export interface PatientDTO {
    nome: string;
    categoria: 'COLABORADOR_UNIDADE' | 'COLABORADOR_ESCOLA' | 'ALUNO' | 'EXTERNO';
    celular: string;
    email: string;
    dataCadastramento: string;
    motivoRestricao: string;
    status: 'ATIVO' | 'INATIVO';
    escola_id?: number | null;   // ← adicione
    unidade_id?: number | null;
}
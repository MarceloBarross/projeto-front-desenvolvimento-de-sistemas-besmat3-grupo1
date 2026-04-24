export interface Patient {
    id: number;
    name: string;
    category: 'Unidade' | 'Escola' | 'Aluno' | 'Externo';
    cellphone: string;
    email: string;
    registrationDate: string;
    status: 'Ativo' | 'Inativo';
}
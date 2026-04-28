// models/coordenador/coordenador-interface.ts
export interface Coordenador {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  status: 'ATIVO' | 'INATIVO';
}

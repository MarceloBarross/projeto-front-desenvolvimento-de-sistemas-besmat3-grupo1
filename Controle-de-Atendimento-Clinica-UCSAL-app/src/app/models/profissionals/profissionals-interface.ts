
export interface Profissionals {
  id: number;
  identificacaoProfissional: string;
  nome: string;
  formacao: string;
  especialidade: string;
  diasHorariosAtendimento: string;
  conselhoRegional: string;
  numeroRegistroConselho: string;
  dataCadastramento: Date;
  status: 'ATIVO' | 'INATIVO';
}

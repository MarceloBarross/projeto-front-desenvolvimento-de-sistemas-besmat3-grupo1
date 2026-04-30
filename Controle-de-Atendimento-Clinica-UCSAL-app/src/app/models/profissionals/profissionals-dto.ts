export interface ProfissionalsDTO {
  identificacaoProfissional: string;
  nome: string;
  formacao: string;
  especialidade: string;
  diasHorariosAtendimento: string;
  conselhoRegional: string;
  numeroRegistroConselho: string;
  status: 'ATIVO' | 'INATIVO';  
}

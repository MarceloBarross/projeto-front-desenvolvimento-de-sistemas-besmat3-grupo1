export interface User {
  name: string;
  email: string;
  role: string;

  formacao?: string;
  conselhoRegional?: string;
  especialidade?: string;
  diasAtendimento?: string;
  horariosAtendimento?: string;
}
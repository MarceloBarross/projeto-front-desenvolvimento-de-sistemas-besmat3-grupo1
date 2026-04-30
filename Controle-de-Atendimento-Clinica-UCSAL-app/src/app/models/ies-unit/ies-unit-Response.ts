import { Coordenador } from "../cordeador/cordenador";
import { Ies } from "../ies/ies-interface";


export interface IesResponse {
  id: number;
  nome: string;
  representante: Coordenador;
  ies: Ies;
  status: string;
}

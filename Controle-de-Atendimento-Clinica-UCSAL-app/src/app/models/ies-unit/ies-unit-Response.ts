import { Coordenador } from "../cordeador/cordenador";
import { Ies } from "../ies/ies-interface";


export interface IesResponse {
  id: number;
  unitName: string;
  representative: Coordenador;
  ies: Ies;
  isAtivo: boolean;
}

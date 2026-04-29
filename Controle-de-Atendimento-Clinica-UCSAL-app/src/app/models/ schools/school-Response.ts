import { Coordenador } from "../cordeador/cordenador";
import { Ies } from "../ies/ies-interface";

export interface SchoolResponse {
    id: number;
    nome: string;
    coordenadorResponsavel: Coordenador;
    ies: Ies;
    status: string;
}

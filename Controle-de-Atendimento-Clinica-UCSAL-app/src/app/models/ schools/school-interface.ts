import { Ies } from "../ies/ies-interface";

export interface School {
    id: number;
    name: string;
    coordenador: string;
    ies: Ies;
    isAtivo: boolean;
}
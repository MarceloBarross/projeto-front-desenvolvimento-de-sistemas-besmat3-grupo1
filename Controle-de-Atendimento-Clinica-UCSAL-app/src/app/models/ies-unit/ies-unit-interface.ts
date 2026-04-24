import { Ies } from '../ies/ies-interface';

export interface IesUnit {
  id: number;
  unitName: string;
  representativeName: string;
  ies: Ies;
  isAtivo: boolean;
}

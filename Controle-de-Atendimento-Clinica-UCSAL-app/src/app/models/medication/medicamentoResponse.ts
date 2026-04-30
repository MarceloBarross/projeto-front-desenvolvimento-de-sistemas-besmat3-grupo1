import { MedicationStatus } from "./statusEnum";

export type StorageType = 'REFRIGERACAO' | 'AMBIENTE';

export interface MedicationResponse {
  id: number;
  nome: string;
  descricaoCompleta: string;
  fornecedor: string;
  formaArmazenamento: StorageType;
  quantidadeEstoque: number;
  dataValidade: string;
  dataAquisicao: string;
  status: MedicationStatus;
}

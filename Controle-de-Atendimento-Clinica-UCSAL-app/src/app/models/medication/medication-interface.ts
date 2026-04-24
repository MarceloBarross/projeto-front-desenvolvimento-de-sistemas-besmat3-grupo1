export type StorageType = 'REFRIGERACAO' | 'AMBIENTE';

export interface Medication {
  id: number;
  name: string;
  description: string;
  supplier: string;
  storageType: StorageType;
  quantity: number;
  expirationDate: string;
  acquisitionDate: string;
  isAtivo: boolean;
}

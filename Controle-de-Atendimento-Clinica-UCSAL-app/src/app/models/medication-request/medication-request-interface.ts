export type RequestPriority = 'URGENTE' | 'CRITICO' | 'PREVENTIVO';

export interface MedicationRequest {
  id: number;
  medicationId: number;
  medicationName: string;
  requestPriority: RequestPriority;
}

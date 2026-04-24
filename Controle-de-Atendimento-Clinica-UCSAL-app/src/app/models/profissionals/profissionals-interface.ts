export interface Profissionals {
  id: number;
  professionalCode: string;
  name: string;
  specialty: string;
  attendanceDays: string;
  attendanceShifts: string;
  regionalCouncil: string;
  councilRegistrationNumber: string;
  registrationDate: string;
  status: 'Ativo' | 'Inativo';
}

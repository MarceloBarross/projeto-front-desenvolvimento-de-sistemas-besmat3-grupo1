export interface ProfissionalsDTO {
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

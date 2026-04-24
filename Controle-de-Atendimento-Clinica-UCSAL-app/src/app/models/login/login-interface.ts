export interface LoginResponse {
  token: string;
  tipo: string;
  usuarioId: number;
  email: string;
  role: string;
  profissionalId: number | null;
}
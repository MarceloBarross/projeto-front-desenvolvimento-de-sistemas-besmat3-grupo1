import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { School } from '../models/ schools/school-interface';

type SchoolPayload = {
  name: string;
  coordenador: string;
  iesName: string;
  isAtivo: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private readonly schoolsSubject = new BehaviorSubject<School[]>([
    {
      id: 1,
      name: 'Escola A',
      coordenador: 'Joao Silva',
      ies: { id: 1, name: 'UCSAL', sigla: 'UCSAL' },
      isAtivo: true,
    },
  ]);

  private readonly coordenadoresSubject = new BehaviorSubject<string[]>([
    'Joao Silva',
  ]);

  listSchools(): Observable<School[]> {
    return this.schoolsSubject.asObservable();
  }

  findById(id: number): Observable<School | undefined> {
    const found = this.schoolsSubject.value.find((school) => school.id === id);
    return of(found);
  }

  createSchool(payload: SchoolPayload): Observable<School> {
    const nextId =
      this.schoolsSubject.value.length > 0
        ? Math.max(...this.schoolsSubject.value.map((school) => school.id)) + 1
        : 1;

    const newSchool: School = {
      id: nextId,
      name: payload.name,
      coordenador: payload.coordenador,
      ies: {
        id: nextId,
        name: payload.iesName,
        sigla: this.toSigla(payload.iesName),
      },
      isAtivo: payload.isAtivo,
    };

    this.schoolsSubject.next([...this.schoolsSubject.value, newSchool]);
    return of(newSchool);
  }

  updateSchool(id: number, payload: SchoolPayload): Observable<School | undefined> {
    const schools = this.schoolsSubject.value;
    const index = schools.findIndex((school) => school.id === id);

    if (index === -1) {
      return of(undefined);
    }

    const updatedSchool: School = {
      ...schools[index],
      name: payload.name,
      coordenador: payload.coordenador,
      ies: {
        ...schools[index].ies,
        name: payload.iesName,
        sigla: this.toSigla(payload.iesName),
      },
      isAtivo: payload.isAtivo,
    };

    const nextSchools = [...schools];
    nextSchools[index] = updatedSchool;
    this.schoolsSubject.next(nextSchools);

    return of(updatedSchool);
  }

  deleteSchool(id: number): Observable<boolean> {
    const nextSchools = this.schoolsSubject.value.filter((school) => school.id !== id);
    const removed = nextSchools.length !== this.schoolsSubject.value.length;
    this.schoolsSubject.next(nextSchools);
    return of(removed);
  }

  toggleSchoolStatus(id: number): Observable<School | undefined> {
    const school = this.schoolsSubject.value.find((item) => item.id === id);

    if (!school) {
      return of(undefined);
    }

    return this.updateSchool(id, {
      name: school.name,
      coordenador: school.coordenador,
      iesName: school.ies.name,
      isAtivo: !school.isAtivo,
    });
  }

  listCoordenadores(): Observable<string[]> {
    return this.coordenadoresSubject.asObservable();
  }

  addCoordenador(name: string): Observable<string[]> {
    const trimmed = name.trim();
    if (!trimmed) {
      return of(this.coordenadoresSubject.value);
    }

    const alreadyExists = this.coordenadoresSubject.value.some(
      (coordenador) => coordenador.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      return of(this.coordenadoresSubject.value);
    }

    const nextCoordenadores = [...this.coordenadoresSubject.value, trimmed];
    this.coordenadoresSubject.next(nextCoordenadores);
    return of(nextCoordenadores);
  }

  private toSigla(value: string): string {
    const words = value
      .split(' ')
      .map((word) => word.trim())
      .filter((word) => word.length > 0);

    if (words.length === 0) {
      return 'IES';
    }

    const sigla = words.map((word) => word[0]).join('');
    return sigla.toUpperCase();
  }
}

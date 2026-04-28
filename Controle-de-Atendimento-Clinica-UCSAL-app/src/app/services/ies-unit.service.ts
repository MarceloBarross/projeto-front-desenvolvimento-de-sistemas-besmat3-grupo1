import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { IesResponse } from '../models/ies-unit/ies-unit-Response';

type IesUnitPayload = {
  unitName: string;
  representativeName: string;
  iesName: string;
  isAtivo: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class IesUnitService {
  private readonly iesUnitsSubject = new BehaviorSubject<IesResponse[]>([
    {
      id: 1,
      unitName: 'Unidade Salvador Centro',
      representative: {
        id: 5,
        nome: 'Responsavel Reitoria',
        email: 'reitoria@ucsal.com',
        telefone: '(71) 4000-2001',
        status: 'ATIVO',
      },
      ies: { id: 1, nome: 'Universidade Catolica do Salvador', sigla: 'UCSAL' },
      isAtivo: true,
    },
  ]);

  private readonly representativesSubject = new BehaviorSubject<string[]>(['Maria Oliveira']);

  listUnits(): Observable<IesResponse[]> {
    return this.iesUnitsSubject.asObservable();
  }

  findById(id: number): Observable<IesResponse | undefined> {
    const found = this.iesUnitsSubject.value.find((unit) => unit.id === id);
    return of(found);
  }

  createUnit(payload: IesUnitPayload): Observable<IesResponse> {
    const nextId =
      this.iesUnitsSubject.value.length > 0
        ? Math.max(...this.iesUnitsSubject.value.map((unit) => unit.id)) + 1
        : 1;

    const newUnit: IesResponse = {
      id: nextId,
      unitName: payload.unitName,
      representative: {
        id: nextId,
        nome: payload.representativeName,
        email: '',
        telefone: '',
        status: 'ATIVO',
      },
      ies: {
        id: nextId,
        nome: payload.iesName,
        sigla: this.toSigla(payload.iesName),
      },
      isAtivo: payload.isAtivo,
    };

    this.iesUnitsSubject.next([...this.iesUnitsSubject.value, newUnit]);
    return of(newUnit);
  }

  updateUnit(id: number, payload: IesUnitPayload): Observable<IesResponse | undefined> {
    const units = this.iesUnitsSubject.value;
    const index = units.findIndex((unit) => unit.id === id);

    if (index === -1) {
      return of(undefined);
    }

    const updatedUnit: IesResponse = {
      ...units[index],
      unitName: payload.unitName,
      representative: {
        ...units[index].representative,
        nome: payload.representativeName,
      },
      ies: {
        ...units[index].ies,
        nome: payload.iesName,
        sigla: this.toSigla(payload.iesName),
      },
      isAtivo: payload.isAtivo,
    };

    const nextUnits = [...units];
    nextUnits[index] = updatedUnit;
    this.iesUnitsSubject.next(nextUnits);

    return of(updatedUnit);
  }

  deleteUnit(id: number): Observable<boolean> {
    const nextUnits = this.iesUnitsSubject.value.filter((unit) => unit.id !== id);
    const removed = nextUnits.length !== this.iesUnitsSubject.value.length;
    this.iesUnitsSubject.next(nextUnits);
    return of(removed);
  }

  toggleUnitStatus(id: number): Observable<IesResponse | undefined> {
    const unit = this.iesUnitsSubject.value.find((item) => item.id === id);

    if (!unit) {
      return of(undefined);
    }

    return this.updateUnit(id, {
      unitName: unit.unitName,
      representativeName: unit.representative.nome,
      iesName: unit.ies.nome,
      isAtivo: !unit.isAtivo,
    });
  }

  listRepresentatives(): Observable<string[]> {
    return this.representativesSubject.asObservable();
  }

  addRepresentative(name: string): Observable<string[]> {
    const trimmed = name.trim();
    if (!trimmed) {
      return of(this.representativesSubject.value);
    }

    const alreadyExists = this.representativesSubject.value.some(
      (representative) => representative.toLowerCase() === trimmed.toLowerCase(),
    );

    if (alreadyExists) {
      return of(this.representativesSubject.value);
    }

    const nextRepresentatives = [...this.representativesSubject.value, trimmed];
    this.representativesSubject.next(nextRepresentatives);
    return of(nextRepresentatives);
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

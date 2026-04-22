import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { Ies } from '../models/ies/ies-interface';

type IesPayload = Omit<Ies, 'id'>;

@Injectable({
	providedIn: 'root'
})
export class IesService {
	iesMock: Ies[] = [
		{
			id: 1,
			name: 'Universidade Catolica do Salvador',
			sigla: 'UCSAL'
		},
		{
			id: 2,
			name: 'Universidade Federal da Bahia',
			sigla: 'UFBA'
		}
	];

	isMock: boolean = true;

	constructor(private http: HttpClient) {}

	listarIes(): Observable<Ies[]> {
		if (this.isMock) {
			return of(this.iesMock).pipe(delay(500));
		}

		return this.http.get<Ies[]>('/api/ies');
	}

	findById(id: number): Observable<Ies | undefined> {
		if (this.isMock) {
			return of(this.iesMock.find((i) => i.id === id)).pipe(delay(500));
		}

		return this.http.get<Ies>(`/api/ies/${id}`);
	}

	cadastrarIes(data: IesPayload): Observable<Ies> {
		if (this.isMock) {
			const newIes: Ies = {
				id: this.iesMock.length + 1,
				...data
			};

			this.iesMock.push(newIes);
			return of(newIes).pipe(delay(500));
		}

		return this.http.post<Ies>('/api/ies', data);
	}

	editarIes(id: number, data: IesPayload): Observable<boolean | object> {
		if (this.isMock) {
			this.iesMock = this.iesMock.map((i) =>
				i.id === id ? { ...i, ...data } : i
			);

			return of(true).pipe(delay(500));
		}

		return this.http.put(`/api/ies/${id}`, data);
	}

	deletarIes(id: number): Observable<void> {
		if (this.isMock) {
			this.iesMock = this.iesMock.filter((item) => item.id !== id);
			return of(void 0).pipe(delay(500));
		}

		return this.http.delete<void>(`/api/ies/${id}`);
	}
}

import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  Proyeccion
} from '../models/proyeccion.model';

@Injectable({
  providedIn: 'root'
})

export class ProyeccionService {

 private apiUrl = 'https://ahorro-api.onrender.com/api/proyecciones';

  constructor(
    private http: HttpClient
  ) {}

  obtenerProyecciones():
  Observable<Proyeccion[]> {

    return this.http.get<
      Proyeccion[]
    >(this.apiUrl);
  }

  crearProyeccion(
    proyeccion: Proyeccion
  ): Observable<Proyeccion> {

    return this.http.post<
      Proyeccion
    >(this.apiUrl, proyeccion);
  }
  actualizarProyeccion(
  id: string,
  proyeccion: Proyeccion
): Observable<Proyeccion> {

  return this.http.put<
    Proyeccion
  >(

    `${this.apiUrl}/${id}`,

    proyeccion
  );
}

eliminarProyeccion(
  id: string
): Observable<any> {

  return this.http.delete(

    `${this.apiUrl}/${id}`
  );
}
}

export interface Proyeccion {

  _id?: string;

  uidFirebase: string;

  emailUsuario: string;

  nombre: string;

  ahorroMensual: number;

  meses: number;

  meta: number;

  gastosFijos: number;

  gastosVariables: number;

  ahorroTotal: number;

  diferenciaMeta: number;

  cumpleMeta: boolean;

  createdAt?: string;
}
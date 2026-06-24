import { ProcesadorArbol } from '../../services/ProcesadorArbol';
import { ArbolGenealogico } from '../../services/ArbolGenealogico';

export class ValidarCronologia {
  private _procesador: ProcesadorArbol;
  private _arbol: ArbolGenealogico;

  constructor(procesador: ProcesadorArbol, arbol: ArbolGenealogico) {
    this._procesador = procesador;
    this._arbol = arbol;
  }

  ejecutar(): Promise<{ valido: boolean; errores: string[]; tiempoMs: number }> {
    return this._procesador.validarConsistencia(this._arbol);
  }
}
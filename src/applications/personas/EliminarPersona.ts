import { ArbolGenealogico } from '../../services/ArbolGenealogico';

export class EliminarPersona {
  private _arbol: ArbolGenealogico;

  constructor(arbol: ArbolGenealogico) {
    this._arbol = arbol;
  }

  ejecutar(id: string): boolean {
    return this._arbol.eliminarPersona(id);
  }
}
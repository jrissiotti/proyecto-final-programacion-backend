import { ArbolGenealogico } from '../../services/ArbolGenealogico';
import { FamiliaDTO } from '../../shared/types/arbol.types';

export class ObtenerFamilia {
  private _arbol: ArbolGenealogico;

  constructor(arbol: ArbolGenealogico) {
    this._arbol = arbol;
  }

  ejecutar(personaId: string): FamiliaDTO {
    return this._arbol.obtenerFamilia(personaId);
  }
}
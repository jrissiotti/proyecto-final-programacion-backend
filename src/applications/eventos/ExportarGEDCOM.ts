import { ArbolGenealogico } from '../../services/ArbolGenealogico';
import { ExportadorGEDCOM } from '../../infrastructure/exportadores/ExportadorGEDCOM';

export class ExportarGEDCOM {
  private _arbol: ArbolGenealogico;

  constructor(arbol: ArbolGenealogico) {
    this._arbol = arbol;
  }

  ejecutar(): string {
    const exportador = new ExportadorGEDCOM();
    return exportador.exportar([...this._arbol.obtenerPersonas()]);
  }
}
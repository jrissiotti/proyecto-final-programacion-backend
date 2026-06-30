import { ArbolGenealogico } from '../../domain/services/ArbolGenealogico';
import { RelacionInvalidaException } from '../../domain/exceptions/RelacionInvalidaException';
import { IArbolRepository } from '../../domain/interfaces/IArbolRepository';

export class EliminarRelacion {
  private _arbol: ArbolGenealogico;
  private _repositorio: IArbolRepository;

  constructor(arbol: ArbolGenealogico, repositorio: IArbolRepository) {
    this._arbol = arbol;
    this._repositorio = repositorio;
  }

  async ejecutar(relacionId: string): Promise<boolean> {
    if (!relacionId) {
      throw new RelacionInvalidaException('ID de relación no proporcionado');
    }
    const exito = this._arbol.eliminarRelacion(relacionId);
    if (exito) {
      await this._repositorio.eliminarRelacion(relacionId);
      
      const historial = this._arbol.obtenerHistorial();
      const ultimoCambio = historial[historial.length - 1];
      if (ultimoCambio) {
        await this._repositorio.guardarCambio(ultimoCambio);
      }
    }
    return exito;
  }
}

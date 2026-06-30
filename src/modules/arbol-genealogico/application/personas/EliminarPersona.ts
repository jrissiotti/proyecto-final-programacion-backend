import { ArbolGenealogico } from '../../domain/services/ArbolGenealogico';
import { IArbolRepository } from '../../domain/interfaces/IArbolRepository';

export class EliminarPersona {
  private _arbol: ArbolGenealogico;
  private _repositorio: IArbolRepository;

  constructor(arbol: ArbolGenealogico, repositorio: IArbolRepository) {
    this._arbol = arbol;
    this._repositorio = repositorio;
  }

  async ejecutar(id: string): Promise<boolean> {
    const exito = this._arbol.eliminarPersona(id);
    if (exito) {
      await this._repositorio.eliminarPersona(id);
      
      const historial = this._arbol.obtenerHistorial();
      const ultimoCambio = historial[historial.length - 1];
      if (ultimoCambio) {
        await this._repositorio.guardarCambio(ultimoCambio);
      }
    }
    return exito;
  }
}
import { ArbolGenealogico } from '../../domain/services/ArbolGenealogico';
import { RelacionFamiliar } from '../../domain/entities/RelacionFamiliar';
import { TipoRelacion } from '../../shared/types/arbol.types';
import { RelacionInvalidaException } from '../../domain/exceptions/RelacionInvalidaException';
import { IArbolRepository } from '../../domain/interfaces/IArbolRepository';
import { v4 as uuidv4 } from 'uuid';

export class CrearRelacion {
  private _arbol: ArbolGenealogico;
  private _repositorio: IArbolRepository;

  constructor(arbol: ArbolGenealogico, repositorio: IArbolRepository) {
    this._arbol = arbol;
    this._repositorio = repositorio;
  }

  async ejecutar(datos: {
    personaOrigenId: string;
    personaDestinoId: string;
    tipo: TipoRelacion;
  }): Promise<RelacionFamiliar> {
    if (!datos.personaOrigenId || !datos.personaDestinoId || !datos.tipo) {
      throw new RelacionInvalidaException('Faltan datos requeridos para crear la relación');
    }

    const id = uuidv4();
    const relacion = new RelacionFamiliar(
      id,
      datos.personaOrigenId,
      datos.personaDestinoId,
      datos.tipo
    );

    this._arbol.agregarRelacion(relacion);
    await this._repositorio.guardarRelacion(relacion);

    const historial = this._arbol.obtenerHistorial();
    const ultimoCambio = historial[historial.length - 1];
    if (ultimoCambio) {
      await this._repositorio.guardarCambio(ultimoCambio);
    }

    return relacion;
  }
}

import { IExportador } from '../../domain/interfaces/IExportador';

/**
 * Exportador genérico que convierte cualquier objeto que implemente `toJSON()`
 * en una colección JSON estructurada. Se usa principalmente para exportar
 * personas completas, pero también puede servir para cualquier otro tipo.
 */
export class ExportadorJSON<T extends { toJSON(): any }> implements IExportador<T> {
  readonly extension: string = 'json';
  readonly mimeType: string = 'application/json';

  /**
   * Convierte el arreglo de datos en un JSON con metadatos básicos.
   * Se mantiene la estructura anterior (FeatureCollection) para compatibilidad
   * con los exportadores existentes.
   */
  exportar(datos: T[]): string {
    const collection = {
      type: 'FeatureCollection',
      metadata: {
        totalItems: datos.length,
        fechaGeneracion: new Date().toISOString()
      },
      features: datos.map(d => d.toJSON())
    };
    return JSON.stringify(collection, null, 2);
  }
}

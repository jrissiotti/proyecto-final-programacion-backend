import { IExportador } from '../../domain/interfaces/IExportador';
import { EventoBase } from '../../domain/entities/EventoBase';

export class ExportadorJSON implements IExportador<EventoBase> {
  readonly extension: string = 'json';
  readonly mimeType: string = 'application/json';

  exportar(datos: EventoBase[]): string {
    const featureCollection = {
      type: 'FeatureCollection',
      metadata: {
        totalEventos: datos.length,
        fechaGeneracion: new Date().toISOString()
      },
      features: datos.map(e => e.toJSON())
    };
    return JSON.stringify(featureCollection, null, 2);
  }
}
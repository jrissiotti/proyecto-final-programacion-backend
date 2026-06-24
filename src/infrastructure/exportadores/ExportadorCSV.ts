import { IExportador } from '../../domain/interfaces/IExportador';
import { EventoBase } from '../../domain/entities/EventoBase';

export class ExportadorCSV implements IExportador<EventoBase> {
  readonly extension: string = 'csv';
  readonly mimeType: string = 'text/csv';

  exportar(datos: EventoBase[]): string {
    const headers = ['id', 'personaId', 'tipo', 'fecha', 'descripcion', 'ubicacion'];
    const rows = datos.map(e => {
      const json = e.toJSON() as any;
      return [
        json.id,
        json.personaId,
        json.tipo,
        json.fecha,
        `"${json.descripcion}"`,
        json.ubicacion?.nombre || ''
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }
}
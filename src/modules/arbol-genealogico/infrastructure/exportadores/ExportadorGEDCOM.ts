import { IExportador } from '../../domain/interfaces/IExportador';
import { Persona } from '../../domain/entities/Persona';
import { Nacimiento } from '../../domain/entities/Nacimiento';
import { Matrimonio } from '../../domain/entities/Matrimonio';
import { Defuncion } from '../../domain/entities/Defuncion';

interface FamiliaGEDCOM {
  id: string;
  esposoId: string | null;
  esposaId: string | null;
  hijosIds: string[];
}

export class ExportadorGEDCOM implements IExportador<Persona> {
  readonly extension: string = 'ged';
  readonly mimeType: string = 'text/plain';

  exportar(datos: Persona[]): string {
    const lineas: string[] = [];
    lineas.push('0 HEAD');
    lineas.push('1 GEDC');
    lineas.push('2 VERS 5.5');
    lineas.push('1 CHAR UTF-8');

    for (const persona of datos) {
      lineas.push(`0 @${persona.id}@ INDI`);
      lineas.push(`1 NAME ${persona.nombre} /${persona.apellido}/`);
      lineas.push(`1 SEX ${persona.genero}`);

      for (const evento of persona.obtenerEventos()) {
        if (evento instanceof Nacimiento) {
          lineas.push('1 BIRT');
          lineas.push(`2 DATE ${this._formatearFecha(evento.fecha)}`);
          lineas.push(`2 PLAC ${evento.ubicacion.nombre}`);
        }
        if (evento instanceof Defuncion) {
          lineas.push('1 DEAT');
          lineas.push(`2 DATE ${this._formatearFecha(evento.fecha)}`);
          lineas.push(`2 PLAC ${evento.ubicacion.nombre}`);
        }
        if (evento instanceof Matrimonio) {
          lineas.push('1 MARR');
          lineas.push(`2 DATE ${this._formatearFecha(evento.fecha)}`);
          lineas.push(`2 PLAC ${evento.ubicacion.nombre}`);
        }
      }
    }

    const familias = this._construirFamilias(datos);
    for (const familia of familias) {
      lineas.push(`0 @${familia.id}@ FAM`);
      if (familia.esposoId) lineas.push(`1 HUSB @${familia.esposoId}@`);
      if (familia.esposaId) lineas.push(`1 WIFE @${familia.esposaId}@`);
      for (const hijoId of familia.hijosIds) {
        lineas.push(`1 CHIL @${hijoId}@`);
      }
    }

    lineas.push('0 TRLR');
    return lineas.join('\n') + '\n';
  }

  private _formatearFecha(fecha: Date): string {
    return fecha.toISOString().split('T')[0].replace(/-/g, ' ');
  }

  private _construirFamilias(personas: Persona[]): FamiliaGEDCOM[] {
    const familias: FamiliaGEDCOM[] = [];
    const familiasProcesadas = new Set<string>();
    let famId = 1;

    for (const persona of personas) {
      for (const evento of persona.obtenerEventos()) {
        if (evento instanceof Matrimonio) {
          const famKey = `${persona.id}`;
          if (!familiasProcesadas.has(famKey)) {
            familiasProcesadas.add(famKey);
            familias.push({
              id: `F${famId++}`,
              esposoId: persona.genero === 'M' ? persona.id : null,
              esposaId: persona.genero === 'F' ? persona.id : null,
              hijosIds: []
            });
          }
        }
      }
    }
    return familias;
  }
}
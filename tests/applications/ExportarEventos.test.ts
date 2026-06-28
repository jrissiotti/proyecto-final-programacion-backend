import { ArbolGenealogico } from '../../src/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/services/ValidadorRelacion';
import { CrearPersona } from '../../src/applications/personas/CrearPersona';
import { CrearEvento } from '../../src/applications/eventos/CrearEvento';
import { ExportarEventos } from '../../src/applications/eventos/ExportarEventos';
import { EventoInvalidoException } from '../../src/exceptions/EventoInvalidoException';

describe('ExportarEventos', () => {
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let crearEvento: CrearEvento;
  let exportarEventos: ExportarEventos;

  beforeEach(() => {
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol);
    crearEvento = new CrearEvento(arbol);
    exportarEventos = new ExportarEventos(arbol);
  });

  test('debe exportar eventos en formato JSON', () => {
    const persona = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Nacimiento',
      ubicacion: { nombre: 'La Paz' }
    });
    
    const resultado = exportarEventos.ejecutar('json');
    expect(resultado).toContain('FeatureCollection');
  });

  test('debe exportar eventos en formato CSV', () => {
    const persona = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Nacimiento',
      ubicacion: { nombre: 'La Paz' }
    });
    
    const resultado = exportarEventos.ejecutar('csv');
    expect(resultado).toContain('id,personaId');
  });

  test('debe exportar eventos de persona especifica', () => {
    const persona = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Nacimiento',
      ubicacion: { nombre: 'La Paz' }
    });
    
    const resultado = exportarEventos.ejecutar('json', persona.id);
    expect(resultado).toContain('FeatureCollection');
  });

  test('debe lanzar excepcion con formato invalido', () => {
    const persona = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Nacimiento',
      ubicacion: { nombre: 'La Paz' }
    });
    
    expect(() => {
      exportarEventos.ejecutar('xml' as any);
    }).toThrow(EventoInvalidoException);
  });

  test('debe lanzar excepcion si persona no existe', () => {
    expect(() => {
      exportarEventos.ejecutar('json', '999');
    }).toThrow(EventoInvalidoException);
  });
});
import { MockArbolRepository } from '../mocks/MockArbolRepository';
import { ArbolGenealogico } from '../../src/modules/arbol-genealogico/domain/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/modules/arbol-genealogico/domain/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/modules/arbol-genealogico/domain/services/ValidadorRelacion';
import { CrearPersona } from '../../src/modules/arbol-genealogico/application/personas/CrearPersona';
import { CrearEvento } from '../../src/modules/arbol-genealogico/application/eventos/CrearEvento';
import { ExportarEventos } from '../../src/modules/arbol-genealogico/application/eventos/ExportarEventos';
import { EventoInvalidoException } from '../../src/modules/arbol-genealogico/domain/exceptions/EventoInvalidoException';

describe('ExportarEventos', () => {
  let repo: MockArbolRepository;
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let crearEvento: CrearEvento;
  let exportarEventos: ExportarEventos;

  beforeEach(() => {
    repo = new MockArbolRepository();
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol, repo);
    crearEvento = new CrearEvento(arbol, repo);
    exportarEventos = new ExportarEventos(arbol);
  });

  test('debe exportar eventos en formato JSON', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    await crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Nacimiento',
      ubicacion: { nombre: 'La Paz' }
    });
    
    const resultado = exportarEventos.ejecutar('json');
    expect(resultado).toContain('FeatureCollection');
  });

  test('debe exportar eventos en formato CSV', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    await crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Nacimiento',
      ubicacion: { nombre: 'La Paz' }
    });
    
    const resultado = exportarEventos.ejecutar('csv');
    expect(resultado).toContain('id,personaId');
  });

  test('debe exportar eventos de persona especifica', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    await crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Nacimiento',
      ubicacion: { nombre: 'La Paz' }
    });
    
    const resultado = exportarEventos.ejecutar('json', persona.id);
    expect(resultado).toContain('FeatureCollection');
  });

  test('debe lanzar excepcion con formato invalido', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    await crearEvento.ejecutar({
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

  test('debe lanzar excepcion si persona no existe', async () => {
    expect(() => {
      exportarEventos.ejecutar('json', '999');
    }).toThrow(EventoInvalidoException);
  });
});
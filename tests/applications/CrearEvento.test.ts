import { MockArbolRepository } from '../mocks/MockArbolRepository';
import { ArbolGenealogico } from '../../src/modules/arbol-genealogico/domain/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/modules/arbol-genealogico/domain/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/modules/arbol-genealogico/domain/services/ValidadorRelacion';
import { CrearPersona } from '../../src/modules/arbol-genealogico/application/personas/CrearPersona';
import { CrearEvento } from '../../src/modules/arbol-genealogico/application/eventos/CrearEvento';
import { EventoInvalidoException } from '../../src/modules/arbol-genealogico/domain/exceptions/EventoInvalidoException';
import { FugaCronologicaException } from '../../src/modules/arbol-genealogico/domain/exceptions/FugaCronologicaException';

describe('CrearEvento', () => {
  let repo: MockArbolRepository;
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let crearEvento: CrearEvento;

  beforeEach(() => {
    repo = new MockArbolRepository();
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol, repo);
    crearEvento = new CrearEvento(arbol, repo);
  });

  test('debe crear evento Nacimiento para una persona', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const evento = await crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Nacimiento en hospital',
      ubicacion: { nombre: 'La Paz' }
    });
    
    expect(evento).toBeDefined();
    expect(persona.obtenerEventos().length).toBe(1);
    expect(persona.obtenerEventos()[0].id).toBe(evento.id);
  });

  test('debe crear evento Matrimonio para una persona', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const evento = await crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Matrimonio',
      fecha: new Date('2015-06-20'),
      descripcion: 'Matrimonio civil',
      ubicacion: { nombre: 'Cochabamba' }
    });
    
    expect(evento).toBeDefined();
    expect(persona.obtenerEventos().length).toBe(1);
  });

  test('debe crear evento Defuncion para una persona', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const evento = await crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Defuncion',
      fecha: new Date('2020-01-15'),
      descripcion: 'Defuncion en hospital',
      ubicacion: { nombre: 'La Paz' }
    });
    
    expect(evento).toBeDefined();
    expect(persona.estaViva()).toBe(false);
  });

  test('debe crear evento Migracion para una persona', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const evento = await crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Migracion',
      fecha: new Date('2010-03-10'),
      descripcion: 'Mudanza por trabajo',
      ubicacion: { nombre: 'Santa Cruz' }
    });
    
    expect(evento).toBeDefined();
    expect(persona.obtenerEventos().length).toBe(1);
  });

  test('debe lanzar excepcion con persona no encontrada', async () => {
    await expect(crearEvento.ejecutar({
        personaId: '999',
        tipo: 'Nacimiento',
        fecha: new Date('1990-01-15'),
        descripcion: 'Nacimiento',
        ubicacion: { nombre: 'La Paz' }
      })).rejects.toThrow(EventoInvalidoException);
  });

  test('debe lanzar excepcion con fecha futura', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    const fechaFutura = new Date();
    fechaFutura.setFullYear(fechaFutura.getFullYear() + 1);
    
    await expect(crearEvento.ejecutar({
        personaId: persona.id,
        tipo: 'Nacimiento',
        fecha: fechaFutura,
        descripcion: 'Nacimiento',
        ubicacion: { nombre: 'La Paz' }
      })).rejects.toThrow(FugaCronologicaException);
  });
});
import { ArbolGenealogico } from '../../src/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/services/ValidadorRelacion';
import { CrearPersona } from '../../src/applications/personas/CrearPersona';
import { CrearEvento } from '../../src/applications/eventos/CrearEvento';
import { EventoInvalidoException } from '../../src/exceptions/EventoInvalidoException';
import { FugaCronologicaException } from '../../src/exceptions/FugaCronologicaException';

describe('CrearEvento', () => {
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let crearEvento: CrearEvento;

  beforeEach(() => {
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol);
    crearEvento = new CrearEvento(arbol);
  });

  test('debe crear evento Nacimiento para una persona', () => {
    const persona = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const evento = crearEvento.ejecutar({
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

  test('debe crear evento Matrimonio para una persona', () => {
    const persona = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const evento = crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Matrimonio',
      fecha: new Date('2015-06-20'),
      descripcion: 'Matrimonio civil',
      ubicacion: { nombre: 'Cochabamba' }
    });
    
    expect(evento).toBeDefined();
    expect(persona.obtenerEventos().length).toBe(1);
  });

  test('debe crear evento Defuncion para una persona', () => {
    const persona = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const evento = crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Defuncion',
      fecha: new Date('2020-01-15'),
      descripcion: 'Defuncion en hospital',
      ubicacion: { nombre: 'La Paz' }
    });
    
    expect(evento).toBeDefined();
    expect(persona.estaViva()).toBe(false);
  });

  test('debe crear evento Migracion para una persona', () => {
    const persona = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    
    const evento = crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Migracion',
      fecha: new Date('2010-03-10'),
      descripcion: 'Mudanza por trabajo',
      ubicacion: { nombre: 'Santa Cruz' }
    });
    
    expect(evento).toBeDefined();
    expect(persona.obtenerEventos().length).toBe(1);
  });

  test('debe lanzar excepcion con persona no encontrada', () => {
    expect(() => {
      crearEvento.ejecutar({
        personaId: '999',
        tipo: 'Nacimiento',
        fecha: new Date('1990-01-15'),
        descripcion: 'Nacimiento',
        ubicacion: { nombre: 'La Paz' }
      });
    }).toThrow(EventoInvalidoException);
  });

  test('debe lanzar excepcion con fecha futura', () => {
    const persona = crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    const fechaFutura = new Date();
    fechaFutura.setFullYear(fechaFutura.getFullYear() + 1);
    
    expect(() => {
      crearEvento.ejecutar({
        personaId: persona.id,
        tipo: 'Nacimiento',
        fecha: fechaFutura,
        descripcion: 'Nacimiento',
        ubicacion: { nombre: 'La Paz' }
      });
    }).toThrow(FugaCronologicaException);
  });
});
import { MockArbolRepository } from '../mocks/MockArbolRepository';
import { ArbolGenealogico } from '../../src/modules/arbol-genealogico/domain/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/modules/arbol-genealogico/domain/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/modules/arbol-genealogico/domain/services/ValidadorRelacion';
import { CrearPersona } from '../../src/modules/arbol-genealogico/application/personas/CrearPersona';
import { CrearEvento } from '../../src/modules/arbol-genealogico/application/eventos/CrearEvento';
import { ActualizarEvento } from '../../src/modules/arbol-genealogico/application/eventos/ActualizarEvento';
import { EventoInvalidoException } from '../../src/modules/arbol-genealogico/domain/exceptions/EventoInvalidoException';

describe('ActualizarEvento', () => {
  let repo: MockArbolRepository;
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let crearEvento: CrearEvento;
  let casoUso: ActualizarEvento;

  beforeEach(() => {
    repo = new MockArbolRepository();
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol, repo);
    crearEvento = new CrearEvento(arbol, repo);
    casoUso = new ActualizarEvento(arbol, repo);
  });

  test('debe actualizar un evento existente con exito', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    const evento = await crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Nacimiento de Juan',
      ubicacion: { nombre: 'La Paz' }
    });

    const eventoActualizado = await casoUso.ejecutar({
      personaId: persona.id,
      eventoId: evento.id,
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-16'),
      descripcion: 'Nacimiento de Juan corregido',
      ubicacion: { nombre: 'Cochabamba' }
    });

    expect(eventoActualizado.descripcion).toBe('Nacimiento de Juan corregido');
    expect(eventoActualizado.fecha.getTime()).toBe(new Date('1990-01-16').getTime());
    expect(eventoActualizado.ubicacion.nombre).toBe('Cochabamba');
  });

  test('debe lanzar excepcion si la persona no existe', async () => {
    await expect(casoUso.ejecutar({
      personaId: '999',
      eventoId: '123',
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Test',
      ubicacion: { nombre: 'La Paz' }
    })).rejects.toThrow(EventoInvalidoException);
  });

  test('debe lanzar excepcion si el evento no existe', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    await expect(casoUso.ejecutar({
      personaId: persona.id,
      eventoId: '999',
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Test',
      ubicacion: { nombre: 'La Paz' }
    })).rejects.toThrow(EventoInvalidoException);
  });
});

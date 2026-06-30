import { MockArbolRepository } from '../mocks/MockArbolRepository';
import { ArbolGenealogico } from '../../src/modules/arbol-genealogico/domain/services/ArbolGenealogico';
import { ValidadorCronologico } from '../../src/modules/arbol-genealogico/domain/services/ValidadorCronologico';
import { ValidadorRelacion } from '../../src/modules/arbol-genealogico/domain/services/ValidadorRelacion';
import { CrearPersona } from '../../src/modules/arbol-genealogico/application/personas/CrearPersona';
import { CrearEvento } from '../../src/modules/arbol-genealogico/application/eventos/CrearEvento';
import { EliminarEvento } from '../../src/modules/arbol-genealogico/application/eventos/EliminarEvento';
import { EventoInvalidoException } from '../../src/modules/arbol-genealogico/domain/exceptions/EventoInvalidoException';

describe('EliminarEvento', () => {
  let repo: MockArbolRepository;
  let arbol: ArbolGenealogico;
  let crearPersona: CrearPersona;
  let crearEvento: CrearEvento;
  let eliminarEvento: EliminarEvento;

  beforeEach(() => {
    repo = new MockArbolRepository();
    arbol = new ArbolGenealogico(new ValidadorCronologico(), new ValidadorRelacion());
    crearPersona = new CrearPersona(arbol, repo);
    crearEvento = new CrearEvento(arbol, repo);
    eliminarEvento = new EliminarEvento(arbol, repo);
  });

  test('debe eliminar evento existente', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    const evento = await crearEvento.ejecutar({
      personaId: persona.id,
      tipo: 'Nacimiento',
      fecha: new Date('1990-01-15'),
      descripcion: 'Nacimiento',
      ubicacion: { nombre: 'La Paz' }
    });
    
    const eliminado = await eliminarEvento.ejecutar(persona.id, evento.id);
    expect(eliminado).toBe(true);
    expect(persona.obtenerEventos().length).toBe(0);
  });

  test('debe retornar false si evento no existe', async () => {
    const persona = await crearPersona.ejecutar({ nombre: 'Juan', apellido: 'Perez', genero: 'M' });
    const eliminado = await eliminarEvento.ejecutar(persona.id, 'evento-inexistente');
    expect(eliminado).toBe(false);
  });

  test('debe lanzar excepcion si persona no existe', async () => {
    await expect(eliminarEvento.ejecutar('999', 'evento-1')).rejects.toThrow(EventoInvalidoException);
  });
});
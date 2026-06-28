import { Worker } from 'worker_threads';
import path from 'path';

describe('Worker', () => {
  const workerPath = path.resolve(__dirname, '../../src/workers/worker.ts');

  test('debe validar consistencia con arbol valido', (done) => {
    const worker = new Worker(workerPath, {
      workerData: {
        personas: [
          { id: '1', nombre: 'Carlos', apellido: 'Perez', genero: 'M', edad: 60, eventos: [] },
          { id: '2', nombre: 'Juan', apellido: 'Perez', genero: 'M', edad: 30, eventos: [] }
        ],
        relaciones: [
          { id: 'r1', personaOrigenId: '1', personaDestinoId: '2', tipo: 'PADRE_DE' }
        ],
        operacion: 'validar_consistencia'
      }
    });

    worker.on('message', (resultado) => {
      expect(resultado.exito).toBe(true);
      expect(resultado.resultado.valido).toBe(true);
      expect(resultado.resultado.errores).toEqual([]);
      worker.terminate();
      done();
    });

    worker.on('error', (err) => {
      worker.terminate();
      done(err);
    });
  }, 10000);

  test('debe detectar ciclo en arbol', (done) => {
    const worker = new Worker(workerPath, {
      workerData: {
        personas: [
          { id: '1', nombre: 'A', apellido: 'A', genero: 'M', edad: 60, eventos: [] },
          { id: '2', nombre: 'B', apellido: 'B', genero: 'M', edad: 40, eventos: [] },
          { id: '3', nombre: 'C', apellido: 'C', genero: 'M', edad: 20, eventos: [] }
        ],
        relaciones: [
          { id: 'r1', personaOrigenId: '1', personaDestinoId: '2', tipo: 'PADRE_DE' },
          { id: 'r2', personaOrigenId: '2', personaDestinoId: '3', tipo: 'PADRE_DE' },
          { id: 'r3', personaOrigenId: '3', personaDestinoId: '1', tipo: 'PADRE_DE' }
        ],
        operacion: 'validar_consistencia'
      }
    });

    worker.on('message', (resultado) => {
      expect(resultado.exito).toBe(true);
      expect(resultado.resultado.valido).toBe(false);
      expect(resultado.resultado.errores.length).toBeGreaterThan(0);
      expect(resultado.resultado.errores[0]).toContain('Ciclo');
      worker.terminate();
      done();
    });

    worker.on('error', (err) => {
      worker.terminate();
      done(err);
    });
  }, 10000);

  test('debe retornar error con operacion desconocida', (done) => {
    const worker = new Worker(workerPath, {
      workerData: {
        personas: [],
        relaciones: [],
        operacion: 'operacion_inexistente'
      }
    });

    worker.on('message', (resultado) => {
      expect(resultado.exito).toBe(false);
      expect(resultado.error).toContain('Operación desconocida');
      worker.terminate();
      done();
    });

    worker.on('error', (err) => {
      worker.terminate();
      done(err);
    });
  }, 10000);
});
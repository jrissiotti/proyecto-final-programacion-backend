import { Worker } from 'worker_threads';
import path from 'path';
import { ArbolGenealogico } from './ArbolGenealogico';

export class ProcesadorArbol {
  private _workerPath: string;

  constructor() {
    const isTs = __filename.endsWith('.ts');
    const ext = isTs ? 'ts' : 'js';
    this._workerPath = path.resolve(__dirname, `../../infrastructure/workers/worker.${ext}`);
  }

  validarConsistencia(arbol: ArbolGenealogico): Promise<{ valido: boolean; errores: string[]; tiempoMs: number }> {
    return new Promise((resolve, reject) => {
      const inicio = Date.now();
      const personasSerializadas = arbol.obtenerPersonas().map(p => p.toJSON());
      const relacionesSerializadas = arbol.obtenerPersonas().flatMap(p => 
        arbol.obtenerRelacionesDePersona(p.id).map(r => r.toJSON())
      );
      const relacionesUnicas = Array.from(new Map(relacionesSerializadas.map(r => [(r as any).id, r])).values());
      const isTest = process.env.NODE_ENV === 'test';

      const worker = new Worker(this._workerPath, {
        workerData: {
          personas: personasSerializadas,
          relaciones: relacionesUnicas,
          operacion: 'validar_consistencia'
        },
        execArgv: isTest ? ['-r', 'ts-node/register'] : undefined
      });

      worker.on('message', (resultado) => {
        const tiempoMs = Date.now() - inicio;
        if (resultado.exito) {
          resolve({ valido: resultado.resultado.valido, errores: resultado.resultado.errores, tiempoMs });
        } else {
          reject(new Error(resultado.error));
        }
      });

      worker.on('error', (err) => reject(err));
      worker.on('exit', (code) => {
        if (code !== 0) reject(new Error(`Worker finalizó con código ${code}`));
      });
    });
  }
}
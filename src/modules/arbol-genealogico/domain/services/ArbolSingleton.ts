import { ArbolGenealogico } from './ArbolGenealogico';
import { ValidadorCronologico } from './ValidadorCronologico';
import { ValidadorRelacion } from './ValidadorRelacion';
import { IArbolRepository } from '../interfaces/IArbolRepository';

export class ArbolSingleton {
  private static _instancia: ArbolGenealogico | null = null;
  private static _repositorio: IArbolRepository | null = null;

  static async inicializar(repositorio: IArbolRepository): Promise<void> {
    ArbolSingleton._repositorio = repositorio;
    ArbolSingleton._instancia = new ArbolGenealogico(
      new ValidadorCronologico(),
      new ValidadorRelacion()
    );

    // Cargar datos desde el repositorio local
    const personas = await repositorio.obtenerPersonas();
    const relaciones = await repositorio.obtenerRelaciones();
    const historial = await repositorio.obtenerHistorial();
    
    ArbolSingleton._instancia.cargarDatos(personas, relaciones, historial);
  }

  static obtenerInstancia(): ArbolGenealogico {
    if (!ArbolSingleton._instancia) {
      ArbolSingleton._instancia = new ArbolGenealogico(
        new ValidadorCronologico(),
        new ValidadorRelacion()
      );
    }
    return ArbolSingleton._instancia;
  }

  static obtenerRepositorio(): IArbolRepository {
    if (!ArbolSingleton._repositorio) {
      throw new Error('Repositorio no inicializado en ArbolSingleton');
    }
    return ArbolSingleton._repositorio;
  }

  static reiniciar(): void {
    ArbolSingleton._instancia = null;
    ArbolSingleton._repositorio = null;
  }
}
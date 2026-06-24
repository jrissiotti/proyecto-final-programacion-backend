import { ArbolGenealogico } from './ArbolGenealogico';
import { ValidadorCronologico } from './ValidadorCronologico';
import { ValidadorRelacion } from './ValidadorRelacion';

export class ArbolSingleton {
  private static _instancia: ArbolGenealogico | null = null;

  static obtenerInstancia(): ArbolGenealogico {
    if (!ArbolSingleton._instancia) {
      ArbolSingleton._instancia = new ArbolGenealogico(
        new ValidadorCronologico(),
        new ValidadorRelacion()
      );
    }
    return ArbolSingleton._instancia;
  }

  static reiniciar(): void {
    ArbolSingleton._instancia = null;
  }
}
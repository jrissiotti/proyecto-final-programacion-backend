import { RelacionFamiliar } from '../entities/RelacionFamiliar';
import { ArbolGenealogico } from '../../services/ArbolGenealogico';

export interface IValidadorRelacion {
  validar(relacion: RelacionFamiliar, arbol: ArbolGenealogico): boolean;
}
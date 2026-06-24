export enum TipoEventoEnum {
  NACIMIENTO = 'Nacimiento',
  MATRIMONIO = 'Matrimonio',
  DEFUNCION = 'Defuncion',
  MIGRACION = 'Migracion'
}

export enum TipoRelacionEnum {
  PADRE_DE = 'PADRE_DE',
  MADRE_DE = 'MADRE_DE',
  CONYUGE_DE = 'CONYUGE_DE'
}

export enum GeneroEnum {
  MASCULINO = 'M',
  FEMENINO = 'F'
}

export enum TipoCambioEnum {
  AGREGAR_PERSONA = 'agregar_persona',
  ELIMINAR_PERSONA = 'eliminar_persona',
  AGREGAR_EVENTO = 'agregar_evento',
  ELIMINAR_EVENTO = 'eliminar_evento',
  AGREGAR_RELACION = 'agregar_relacion'
}
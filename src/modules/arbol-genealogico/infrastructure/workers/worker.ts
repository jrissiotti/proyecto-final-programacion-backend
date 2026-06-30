import { parentPort, workerData } from 'worker_threads';

interface WorkerData {
  personas: any[];
  relaciones: any[];
  operacion: string;
}

const { personas, relaciones, operacion } = workerData as WorkerData;

if (operacion === 'validar_consistencia') {
  const errores: string[] = [];
  const idsPersonas = new Set(personas.map((p: any) => p.id));

  for (const r of relaciones) {
    if (!idsPersonas.has(r.personaOrigenId)) {
      errores.push(`Relación ${r.id}: persona origen ${r.personaOrigenId} no existe`);
    }
    if (!idsPersonas.has(r.personaDestinoId)) {
      errores.push(`Relación ${r.id}: persona destino ${r.personaDestinoId} no existe`);
    }
  }

  const relacionesPadreHijo = relaciones.filter((r: any) => 
    r.tipo === 'PADRE_DE' || r.tipo === 'MADRE_DE'
  );

  const adjacencia = new Map<string, string[]>();
  for (const r of relacionesPadreHijo) {
    if (!adjacencia.has(r.personaDestinoId)) {
      adjacencia.set(r.personaDestinoId, []);
    }
    adjacencia.get(r.personaDestinoId)!.push(r.personaOrigenId);
  }

  const visitados = new Set<string>();
  const enStack = new Set<string>();

  function tieneCiclo(nodo: string): boolean {
    visitados.add(nodo);
    enStack.add(nodo);
    const padres = adjacencia.get(nodo) || [];
    for (const padre of padres) {
      if (!visitados.has(padre)) {
        if (tieneCiclo(padre)) return true;
      } else if (enStack.has(padre)) {
        return true;
      }
    }
    enStack.delete(nodo);
    return false;
  }

  for (const persona of personas) {
    if (!visitados.has(persona.id)) {
      if (tieneCiclo(persona.id)) {
        errores.push(`Ciclo detectado en el árbol genealógico desde persona ${persona.id}`);
        break;
      }
    }
  }

  const mapaPersonas = new Map(personas.map((p: any) => [p.id, p]));
  for (const r of relacionesPadreHijo) {
    const padre = mapaPersonas.get(r.personaOrigenId);
    const hijo = mapaPersonas.get(r.personaDestinoId);
    if (padre && hijo && padre.edad !== null && hijo.edad !== null) {
      if (padre.edad <= hijo.edad) {
        errores.push(`Relación ${r.id}: padre ${padre.id} no es mayor que hijo ${hijo.id}`);
      }
      if (padre.edad - hijo.edad < 12) {
        errores.push(`Relación ${r.id}: diferencia de edad entre padre ${padre.id} e hijo ${hijo.id} es menor a 12 años`);
      }
    }
  }

  parentPort?.postMessage({
    exito: true,
    resultado: { valido: errores.length === 0, errores }
  });
} else if (operacion === 'exportar') {
  const resumen = personas.map((p: any) => ({
    id: p.id,
    nombre: `${p.nombre} ${p.apellido}`,
    totalEventos: p.eventos?.length || 0
  }));
  parentPort?.postMessage({ exito: true, resultado: resumen });
} else {
  parentPort?.postMessage({ exito: false, error: `Operación desconocida: ${operacion}` });
}
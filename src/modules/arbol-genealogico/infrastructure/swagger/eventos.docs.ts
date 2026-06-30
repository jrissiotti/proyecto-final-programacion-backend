/**
 * @swagger
 * components:
 *   schemas:
 *     Evento:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         personaId:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [Nacimiento, Matrimonio, Defuncion, Migracion]
 *         fecha:
 *           type: string
 *           format: date-time
 *         descripcion:
 *           type: string
 *         ubicacion:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *         impacto:
 *           type: string
 *     
 *     CrearEventoRequest:
 *       type: object
 *       required:
 *         - tipo
 *         - fecha
 *         - descripcion
 *         - ubicacion
 *       properties:
 *         tipo:
 *           type: string
 *           enum: [Nacimiento, Matrimonio, Defuncion, Migracion]
 *           example: "Nacimiento"
 *         fecha:
 *           type: string
 *           format: date-time
 *           example: "1990-01-15T00:00:00.000Z"
 *         descripcion:
 *           type: string
 *           example: "Nacimiento en hospital"
 *         ubicacion:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               example: "La Paz"
 *     
 *     ValidacionResponse:
 *       type: object
 *       properties:
 *         valido:
 *           type: boolean
 *         errores:
 *           type: array
 *           items:
 *             type: string
 *         tiempoMs:
 *           type: integer
 *     
 *     Cambio:
 *       type: object
 *       properties:
 *         tipo:
 *           type: string
 *         entidadId:
 *           type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 * 
 * /personas/{personaId}/eventos:
 *   get:
 *     summary: Listar eventos de una persona
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: personaId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Evento'
 *       404:
 *         description: Persona no encontrada
 *   
 *   post:
 *     summary: Crear evento para una persona
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: personaId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearEventoRequest'
 *     responses:
 *       201:
 *         description: Evento creado
 *       400:
 *         description: Error de validación (fecha futura, persona no existe)
 * 
 * /personas/{personaId}/eventos/{eventoId}:
 *   delete:
 *     summary: Eliminar evento
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: personaId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: eventoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento eliminado
 *       404:
 *         description: Evento o persona no encontrada
 * 
 * /validar:
 *   post:
 *     summary: Validar cronología del árbol genealógico
 *     tags: [Validación]
 *     responses:
 *       200:
 *         description: Resultado de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/ValidacionResponse'
 * 
 * /exportar/{formato}:
 *   get:
 *     summary: Exportar eventos en formato JSON o CSV
 *     tags: [Exportación]
 *     parameters:
 *       - in: path
 *         name: formato
 *         required: true
 *         schema:
 *           type: string
 *           enum: [json, csv]
 *       - in: query
 *         name: personaId
 *         schema:
 *           type: string
 *         description: ID de persona específica (opcional)
 *     responses:
 *       200:
 *         description: Archivo exportado
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 * 
 * /exportar/gedcom:
 *   get:
 *     summary: Exportar árbol genealógico en formato GEDCOM
 *     tags: [Exportación]
 *     responses:
 *       200:
 *         description: Archivo GEDCOM
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 * 
 * /historial:
 *   get:
 *     summary: Obtener historial de cambios
 *     tags: [Historial]
 *     responses:
 *       200:
 *         description: Lista de cambios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cambio'
 */
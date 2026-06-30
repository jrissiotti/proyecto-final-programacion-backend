/**
 * @swagger
 * components:
 *   schemas:
 *     Persona:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         nombre:
 *           type: string
 *           example: "Juan"
 *         apellido:
 *           type: string
 *           example: "Perez"
 *         genero:
 *           type: string
 *           enum: [M, F]
 *           example: "M"
 *         eventos:
 *           type: array
 *           items:
 *             type: object
 *         fechaNacimiento:
 *           type: string
 *           nullable: true
 *           example: "1990-01-15T00:00:00.000Z"
 *         fechaDefuncion:
 *           type: string
 *           nullable: true
 *           example: null
 *         edad:
 *           type: integer
 *           nullable: true
 *           example: 34
 *         estaViva:
 *           type: boolean
 *           example: true
 *     
 *     CrearPersonaRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - genero
 *       properties:
 *         nombre:
 *           type: string
 *           example: "Juan"
 *         apellido:
 *           type: string
 *           example: "Perez"
 *         genero:
 *           type: string
 *           enum: [M, F]
 *           example: "M"
 *     
 *     FamiliaDTO:
 *       type: object
 *       properties:
 *         persona:
 *           $ref: '#/components/schemas/Persona'
 *         padres:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Persona'
 *         conyuges:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Persona'
 *         hijos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Persona'
 * 
 * /personas:
 *   get:
 *     summary: Listar todas las personas
 *     tags: [Personas]
 *     responses:
 *       200:
 *         description: Lista de personas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Persona'
 *   
 *   post:
 *     summary: Crear una nueva persona
 *     tags: [Personas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearPersonaRequest'
 *     responses:
 *       201:
 *         description: Persona creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Persona'
 *       500:
 *         description: Error interno
 * 
 * /personas/buscar:
 *   get:
 *     summary: Buscar personas por nombre o apellido
 *     tags: [Personas]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Texto a buscar
 *         example: "Juan"
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Persona'
 *       400:
 *         description: Parámetro q requerido
 * 
 * /personas/{id}:
 *   get:
 *     summary: Obtener persona por ID
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Persona encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Persona'
 *       404:
 *         description: Persona no encontrada
 *   
 *   delete:
 *     summary: Eliminar persona
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Persona eliminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     eliminado:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Persona no encontrada
 * 
 * /personas/{id}/familia:
 *   get:
 *     summary: Obtener familia de una persona
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Familia obtenida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/FamiliaDTO'
 *       404:
 *         description: Persona no encontrada
 */
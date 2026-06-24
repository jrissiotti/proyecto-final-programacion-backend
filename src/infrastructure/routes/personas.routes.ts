import { Router } from 'express';
import { PersonasController } from '../controllers/PersonasController';

const router = Router();

router.get('/', PersonasController.listar);
router.get('/buscar', PersonasController.buscar);
router.get('/:id', PersonasController.obtener);
router.post('/', PersonasController.crear);
router.delete('/:id', PersonasController.eliminar);
router.get('/:id/familia', PersonasController.obtenerFamilia);

export default router;
import express from 'express';
import usuarios from '../../controllers/v1/usuarios.js';
import multer from 'multer';
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.get('/', usuarios.verUsuarios);
router.post('/', usuarios.crearUsuario);
router.get('/:id', usuarios.verUsuario);
router.put('/:id', usuarios.actualizarUsuario);
router.put('/:id/foto',upload.single('file') , usuarios.actualizarFoto);
router.delete('/:id', usuarios.eliminarUsuario);

export default router;
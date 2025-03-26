import express from 'express';
import animal from "../controllers/animal.js";
import { checkValidation } from './public/middleware/validation.js';

const router = express.Router();
router.get('/:name?', animal.index);
router.post('/', checkValidation(animal.rules), animal.add);
router.delete('/:name?', animal.delete);
router.put('/', animal.update);

export default router;
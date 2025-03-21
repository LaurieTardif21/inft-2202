import express from 'express';
import product from "../controllers/product.js";
import { checkValidation } from '../middleware/validation.js';

const router = express.Router();
router.get('/:name?', product.index);
router.post('/', checkValidation(product.rules), product.add);
router.delete('/:name?', product.delete);
router.put('/:name', product.update);

export default router;
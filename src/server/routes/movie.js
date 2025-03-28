import express from 'express';
import movie from "../controllers/movie.js";
import { checkValidation } from '../middleware/validation.js';

const router = express.Router();
router.get('/:title?', movie.index);
router.post('/', checkValidation(movie.rules), movie.add);

export default router;
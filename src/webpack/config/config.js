import bodyParser from 'body-parser';
import animalRouter from './public/routes/animal.js';
import { loggingMiddleware } from './public/middleware/logging.js';
import { errorHandler } from './public/middleware/errorhandler.js';
import { query, validationResult } from 'express-validator';

// Validation middleware for page, perPage, and user
function validateQueryParams(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(409).json({ errors: result.array() }); // Send 409 Conflict error if validation fails
    }
    next(); // If no errors, continue to the next middleware or route handler
}

function config(app) {
    // Parse JSON bodies and URL-encoded bodies
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    
    app.use(loggingMiddleware);

    // Validation for query parameters
    app.use([
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('page must be a positive integer (>=1)'),
        query('perPage')
            .optional()
            .isInt({ min: 1 })
            .withMessage('perPage must be a positive integer (>=1)'),
        query('user')
            .optional()
            .isInt()
            .withMessage('user must be a valid integer'),
        validateQueryParams, // Custom validation handler
    ]);

    // Define your API routes
    app.use('/api/animals', animalRouter);

    // Error handler middleware (should be the last middleware)
    app.use(errorHandler);
}

export default config;
import { validationResult } from 'express-validator';
import { ConflictError } from '../errors/ConflictError.js';

function doValidation (request, response, next) {
  const result = validationResult(request);
  if (result.isEmpty()) {
    // Pass the sanitized data to the next middleware
    return next(); 
  }
  const errObj = { 
    errors: result.array() 
  };
  next(new ConflictError('Input Validation Failed', errObj));
}

export function checkValidation (rules) {
  // Ensure rules is always an array
  const normalizedRules = Array.isArray(rules) ? rules : [];
  return [...normalizedRules, doValidation];
}
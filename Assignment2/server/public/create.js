// Name: Laurie Tardif
// Date: 02/08/2025
// Course Code: INFT 2202
// Section Number: 05
// Description of file: create js
import { checkSchema, validationResult } from 'express-validator';
export const handle = (request, response, next) => {
    response.end('create product')
}

export function CheckValidation (rules){
    return [rules, validationResult];
}

function CheckValidation (request, response, next)
{
    const result = validationResult (request);
    if (result.isEmpty()) {return next(); }
    response.status(409).json({errors: result.array()});
}


const rules = checkSchema({
    page: {
    isNumeric: true,
    errorMessage: `"page" must be numeric!`
    },
});

export default {handle};
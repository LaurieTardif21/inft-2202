// Name: Laurie Tardif
// Date: 02/08/2025
// Course Code: INFT 2202
// Section Number: 05
// Description of file: search js
import { checkSchema } from 'express-validator';
import Product from '../../models/Product.js';

const rules = checkSchema({
    page: {
    isNumeric: true,
    errorMessage: `"page" must be numeric!`
    },
});

const handle = async (request, response, next) => {

    try{
        const {page = 1, perPage = 5} = request.query;

        const count = await ProductcountDocuments();
        const pages = Math.ceil(count / perPage);

        const pagination = {
            page: parseInt(page),
            perPage: parseInt(perPage),
            count,
            pages
        }

        const where = {};
        const fields = {};
        const opts = {
            skip: (page-1) * perPage,
            limit: perPage,
            sort: {
                createdAt: -1
            }

        };

        const records = await Product.fin(where, fields, opts);


        response.json({ pagination, records });
    }

    catch(error) {
        console.log(error);
        next(error);
    }

}

export default Product;
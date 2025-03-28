import dataService from '../service/dataService.js';
import { checkSchema } from 'express-validator';

const movieService = dataService('movie');

const movie = {
    rules: [
        checkSchema({
            page: {
                optional: true,
                toInt: true,
                isInt: {
                    options: { min: 1 },
                    errorMessage: '"page" must be a positive number!',
                }
            },
            perPage: {
                isNumeric: true,
                errorMessage: '"perPage" must be a Number!',
                optional: true
            }
        }, ['query']),
        checkSchema({
            user: {
                isNumeric: true,
                errorMessage: '"user" is needed as a Number!',
                toInt: true
            }
        }, ['headers'])
    ],
    index: async function (req, res) {
        try {
            let ret;
            const user = req.headers['user'];
            if (req.params.title) {
                ret = await movieService.query(req.params.title);
            } else {
                ret = await movieService.load(req.query);
            }
            res.json(ret);
        }
        catch (err) {
            res.status(400).send(err);
        }
    }
};

export default movie;

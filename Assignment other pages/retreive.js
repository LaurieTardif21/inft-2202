import Product from '../../models/Product.js';

const handle = async(request, response, next) =>{
    try{
        const product = Product.findOne({
            _id: request.params.ProductID
        });
        response.json(product);
    }
    catch(error){
        next(error);
    }
};

export default {handle};
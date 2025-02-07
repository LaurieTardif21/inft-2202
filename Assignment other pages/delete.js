// src/server/controllers\animals/delete.js
import Product from '../../models/product.js';

const deleteProductController = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: id });
    if (!deletedProduct) {
      return res.status(404).send('Product not found');
    }
    res.send(`Product deleted: ${deletedProduct}`);
  } catch (error) {
    res.status(500).send(`Error deleting product: ${error.message}`);
  }
};
export { Product, deleteProductController };
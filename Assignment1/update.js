// src/server/controllers/animals/update.js
import Product from '../../models/Product.js';

const updateProductController = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedProduct = await Product.findOneAndUpdate({ _id: id }, updateData, { new: true });
    if (!updatedProduct) {
      return res.status(404).send('Animal not found');
    }
    res.send(`Product updated: ${updatedProduct}`);
  } catch (error) {
    res.status(500).send(`Error updating product: ${error.message}`);
  }
};

export default updateProductController
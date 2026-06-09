import express from 'express';
import { upload } from '../configs/multer.js';
import authSeller from '../middlewares/authSeller.js';
import { addProduct, changeStock, productById, productList } from '../controllers/productController.js';
import Product from '../models/Product.js';

const productRouter = express.Router();

productRouter.post(
    '/add',
    authSeller,
    upload.array('images', 4),
    addProduct
  );

productRouter.get('/list', productList )
productRouter.get('/id/:id', productById)
productRouter.post('/stock', authSeller, changeStock)
productRouter.post('/update', authSeller, async (req, res) => {
  try {
    const { id, name, description, category, quantityOptions } = req.body;

    await Product.findByIdAndUpdate(id, {
      name,
      description,
      category,
      quantityOptions }
    );
    
    res.json({ success: true, message: "Product Updated" });
    console.log("UPDATE BODY:", req.body);

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});


export default productRouter;


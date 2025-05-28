const express = require('express');
const router = express.Router();
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.post('/', protect, authorize('shopkeeper'), addProduct);
router.put('/:id', protect, authorize('shopkeeper'), updateProduct);
router.delete('/:id', protect, authorize('shopkeeper'), deleteProduct);

module.exports = router;

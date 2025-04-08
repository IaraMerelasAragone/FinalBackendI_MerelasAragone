const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct
} = require('../controllers/ProductController');

//obtener productos con paginacion, filtros y ordenamiento
router.get('/', getProducts);

//obtener producto por id
router.get('/:pid', getProductById);

//crear producto
router.post('/', createProduct);

//eliminar producto
router.delete('/:pid', deleteProduct);

module.exports = router;
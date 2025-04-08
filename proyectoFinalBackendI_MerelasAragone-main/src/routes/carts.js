const express = require('express');
const router = express.Router();

const {
    createCart,
    getCartById,
    addProductToCart,
    updateCart,
    updateProductQuantity,
    deleteProductFromCart,
    clearCart
} = require('../controllers/CartController');

//crear un nuevo carrito
router.post('/', createCart);

//obtener carrito por id con populate
router.get('/:cid', getCartById);

//agregar producto al carrito
router.post('/:cid/products/:pid', addProductToCart);

//reemplazar todos los productos del carrito
router.put('/:cid', updateCart);

//actualizar cantidad de un producto específico
router.put('/:cid/products/:pid', updateProductQuantity);

//eliminar un producto del carrito
router.delete('/:cid/products/:pid', deleteProductFromCart);

//vaciar el carrito
router.delete('/:cid', clearCart);

module.exports = router;
const CartManager = require('../managers/CartManager');
const cartManager = new CartManager();

// Crear un nuevo carrito
const createCart = async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener carrito por ID con populate
const getCartById = async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Agregar producto al carrito
const addProductToCart = async (req, res) => {
    try {
        const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Reemplazar todos los productos del carrito
const updateCart = async (req, res) => {
    try {
        const updatedCart = await cartManager.updateCart(req.params.cid, req.body);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar cantidad de un producto específico
const updateProductQuantity = async (req, res) => {
    try {
        const { quantity } = req.body;
        const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar un producto del carrito
const deleteProductFromCart = async (req, res) => {
    try {
        const updatedCart = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Vaciar el carrito
const clearCart = async (req, res) => {
    try {
        const updatedCart = await cartManager.clearCart(req.params.cid);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createCart,
    getCartById,
    addProductToCart,
    updateCart,
    updateProductQuantity,
    deleteProductFromCart,
    clearCart
};
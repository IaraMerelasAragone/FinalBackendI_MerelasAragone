const express = require('express');
const router = express.Router();
const Product = require('../models/Product.model');
const Cart = require('../models/Cart.model');

//vista paginada de productos
router.get('/products', async (req, res) => {
    const { page = 1 } = req.query;
    const result = await Product.paginate({}, {
        page,
        limit: 5,
        lean: true
    });

    res.render('products', {
        products: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage
    });
});

//vista de detalle de producto por id
router.get('/products/:pid', async (req, res) => {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send('Producto no encontrado');
    res.render('productDetail', { product });
});

//vista de carrito con populate
router.get('/carts/:cid', async (req, res) => {
    const cart = await Cart.findById(req.params.cid)
        .populate('products.product')
        .lean();

    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cart', { cart });
});

//agregar producto al carrito desde vista (con sesion)
router.post('/carts/insert/:pid', async (req, res) => {
    const { pid } = req.params;
    const quantity = parseInt(req.body.quantity) || 1;

    //usar carrito por sesión
    let cartId = req.session.cartId;

    if (!cartId) {
        const newCart = await Cart.create({ products: [] });
        req.session.cartId = newCart._id.toString(); //guardar en sesión
        cartId = newCart._id;
    }

    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    const existing = cart.products.find(p => p.product.toString() === pid);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.products.push({ product: pid, quantity });
    }

    await cart.save();

    res.redirect(`/carts/${cartId}`);
});

module.exports = router;
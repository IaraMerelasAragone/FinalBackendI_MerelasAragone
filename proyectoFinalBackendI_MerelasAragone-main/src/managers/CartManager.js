const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');

class CartManager {
    async createCart() {
        return await Cart.create({ products: [] });
    }

    async getCartById(cid) {
        return await Cart.findById(cid).populate('products.product');
    }

    async addProductToCart(cid, pid) {
        const cart = await this.getCartById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const product = await Product.findById(pid);
        if (!product) throw new Error('Producto no encontrado');

        const existingProduct = cart.products.find(p => p.product._id.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        return await cart.save();
    }

    async updateCart(cid, products) {
        const cart = await this.getCartById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        for (const item of products) {
            const productExists = await Product.findById(item.product);
            if (!productExists) throw new Error(`Producto inválido: ${item.product}`);
        }

        cart.products = products;
        return await cart.save();
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cart = await this.getCartById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const product = cart.products.find(p => p.product._id.toString() === pid);
        if (!product) throw new Error('Producto no está en el carrito');

        product.quantity = quantity;
        return await cart.save();
    }

    async deleteProductFromCart(cid, pid) {
        const cart = await this.getCartById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = cart.products.filter(p => p.product._id.toString() !== pid);
        return await cart.save();
    }

    async clearCart(cid) {
        const cart = await this.getCartById(cid);
        if (!cart) throw new Error('Carrito no encontrado');

        cart.products = [];
        return await cart.save();
    }
}

module.exports = CartManager;
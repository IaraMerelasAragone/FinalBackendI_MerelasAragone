const Product = require('../models/Product.model');
const initialProducts = require('./products.json'); //cargo desde .json

const loadInitialProducts = async () => {
    try {
        const count = await Product.countDocuments();
        if (count === 0) {
            await Product.insertMany(initialProducts);
            console.log('🛒 Productos iniciales cargados en MongoDB desde products.json');
        } else {
            console.log('✅ Ya hay productos en la base, no se cargaron duplicados');
        }
    } catch (error) {
        console.error('❌ Error al cargar productos:', error.message);
    }
};

module.exports = loadInitialProducts;
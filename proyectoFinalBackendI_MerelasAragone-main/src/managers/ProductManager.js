const Product = require('../models/Product.model');

class ProductManager {
    async getAll({ limit = 10, page = 1, sort, query }) {
        const filter = {};
        if (query) {
            if (query === 'disponibles') filter.status = true;
            else filter.category = query;
        }

        const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOption,
            lean: true
        };

        return await Product.paginate(filter, options);
    }

    async getById(id) {
        return await Product.findById(id);
    }

    async create(data) {
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];

        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Falta el campo obligatorio: ${field}`);
            }
        }

        return await Product.create(data);
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }

    async update(id, updatedFields) {
        const allowedFields = ['title', 'description', 'code', 'price', 'stock', 'category', 'status', 'thumbnails'];

        const invalidFields = Object.keys(updatedFields).filter(
            key => !allowedFields.includes(key)
        );

        if (invalidFields.length > 0) {
            throw new Error(`Campos no válidos en la actualización: ${invalidFields.join(', ')}`);
        }

        return await Product.findByIdAndUpdate(id, updatedFields, { new: true });
    }
}

module.exports = ProductManager;
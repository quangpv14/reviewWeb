import { errorHandler } from '../utils/error.js';
import Product from '../models/product.model.js';

export const createProduct = async (req, res, next) => {
    const title = req.body.title;
    try {
        // Check if product title already exists
        const existingProduct = await Product.findOne({ title });
        if (existingProduct) {
            return next(errorHandler(400, 'Product already exists'));
        }

        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.productId,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to delete this product"));
    }
    try {
        const product = await Product.findByIdAndDelete(req.params.productId);

        if (!product) {
            return next(errorHandler(404, "Product not found"));
        }

        res.status(200).json("The product has been deleted");
    } catch (error) {
        next(error);
    }
};

export const getProductByCategory = async (req, res, next) => {
    try {
        const categoryName = req.query.categoryName;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const products = await Product.find({ category: categoryName })

        res.status(200).json({ products: products });
    } catch (error) {
        next(error);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const productId = req.query.productId;
        const sortDirection = req.query.order === "asc" ? 1 : -1;
        const product = await Product.find({ _id: productId })

        res.status(200).json({ product: product });
    } catch (error) {
        next(error);
    }
};

export const getInitProducts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await Product.find().limit(limit);

        res.status(200).json({ products: products });
    } catch (error) {
        next(error);
    }
};

export const getSearchProducts = async (req, res, next) => {
    try {
        const searchText = req.query.searchText;
        const query = {};

        if (searchText) {
            query.$or = [
                { title: { $regex: searchText, $options: "i" } },
            ];
        }
        const products = await Product.find(query);

        res.status(200).json({ products: products });
    } catch (error) {
        next(error);
    }
};
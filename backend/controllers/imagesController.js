const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/productModel');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Define Cloudinary storage using multer-storage-cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Specify a folder to store images in Cloudinary
        allowed_formats: ['jpeg', 'jpg', 'png', 'webp', 'avif'],
        public_id: (req, file) => `${file.fieldname}-${Date.now()}`, // Unique file naming
    }
});

// Multer upload configuration
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
        if (allowedFileTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});

// Handle single image upload
const uploadSingle = upload.single('image');

// Upload image handler
const uploadImage = (req, res) => {
    uploadSingle(req, res, async (err) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: err.message });
        } else if (req.file) {
            const { id, index } = req.body;

            // Ensure the product ID is provided
            if (!id) {
                return res.status(400).json({ error: 'Please specify the product id' });
            }

            // Find the product by ID
            const product = await Product.findById(id);
            if (!product) {
                return res.status(400).json({ error: 'Product not found' });
            }

            // Update product image at the specified index
            product.images[index] = req.file.path; // Cloudinary provides a path (URL) for the uploaded image
            await product.save();

            return res.status(200).json({
                message: 'File uploaded successfully',
                image: req.file.path // Return the Cloudinary image URL
            });
        } else {
            console.log('No file uploaded');
            return res.status(400).json({ error: 'No file uploaded' });
        }
    });
};

// Delete image handler
const deleteImage = asyncHandler(async (req, res) => {
    try {
        const { id, index } = req.body;

        // Validate request parameters
        if (!id || (!index && index !== 0)) {
            return res.status(400).json({ message: 'Please specify the image correctly' });
        }

        // Find the product by ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(400).json({ message: 'Product not found' });
        }

        // Ensure the product has more than one image
        if (product.images.length === 1) {
            return res.status(402).json({ message: 'Product must have at least one image' });
        }

        // Validate the index
        if (index < 0 || index >= product.images.length) {
            return res.status(400).json({ message: 'Invalid image index' });
        }

        // Delete image from Cloudinary
        const imageToDelete = product.images[index];
        const imagePublicId = imageToDelete.split('/').pop().split('.')[0]; // Extract the public ID from the URL
        await cloudinary.uploader.destroy(imagePublicId);

        // Remove image from product
        product.images.splice(index, 1);
        await product.save();

        return res.status(200).json({ message: 'Image deleted successfully', product });
    } catch (error) {
        return res.status(400).json({ error: 'Something went wrong' });
    }
});

module.exports = {
    uploadImage,
    deleteImage
};

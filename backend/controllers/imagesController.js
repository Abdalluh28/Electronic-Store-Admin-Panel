const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/productModel');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Set up Multer to use Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'product-images',  // Folder name on Cloudinary
    allowedFormats: ['jpeg', 'jpg', 'png', 'webp', 'avif'],
  },
});

const upload = multer({ storage });

const uploadSingle = upload.single('image');

// Upload image to Cloudinary
const uploadImage = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: err.message });
    } else if (req.file) {
      const { id, index } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Please specify the product id' });
      }

      const product = await Product.findById(id);
      if (!product) {
        return res.status(400).json({ error: 'Product not found' });
      }

      product.images[index] = req.file.path;  // Cloudinary URL
      await product.save();

      return res.status(200).json({
        message: 'File uploaded successfully',
        image: req.file.path,  // Cloudinary image URL
      });
    } else {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
  });
};

// Delete image from Cloudinary (if needed)
const deleteImage = asyncHandler(async (req, res) => {
  const { id, index } = req.body;

  if (!id || (!index && index !== 0)) {
    return res.status(400).json({ message: 'Please specify the image correctly' });
  }

  const product = await Product.findById(id);
  if (!product) {
    return res.status(400).json({ message: 'Product not found' });
  }

  if (product.images.length === 1) {
    return res.status(402).json({ message: 'Product must have at least one image' });
  }

  if (index < 0 || index >= product.images.length) {
    return res.status(400).json({ message: 'Invalid image index' });
  }

  const imageUrl = product.images[index];

  // Extract Cloudinary public_id from the URL
  const publicId = imageUrl.split('/').pop().split('.')[0];  // Modify if necessary based on your Cloudinary URL structure

  // Remove from Cloudinary
  cloudinary.uploader.destroy(publicId, function (error, result) {
    if (error) {
      return res.status(400).json({ message: 'Failed to delete image from Cloudinary', error });
    }
  });

  product.images.splice(index, 1);
  await product.save();

  return res.status(200).json({ message: 'Image deleted successfully', product });
});

module.exports = {
  uploadImage,
  deleteImage,
};

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    moreInfo: { type: String },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    badge: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

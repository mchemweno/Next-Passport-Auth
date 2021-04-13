import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    imageUrl: {type: String, required: true}
});


export default mongoose.models.Product || mongoose.model('Product', ProductSchema);

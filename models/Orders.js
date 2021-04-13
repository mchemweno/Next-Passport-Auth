import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProductSchema = new mongoose.Schema({
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    cost: {
        type: Number,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['to_be_shipped', 'shipped', 'delivered']
    }
});


export default mongoose.models.Order || mongoose.model('Order', ProductSchema);

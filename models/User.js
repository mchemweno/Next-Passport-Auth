import hashSalt from "../utils/authUtils/hashSalt";
import dbConnect from "../utils/dbConnect";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        salt: {
            type: String,
        },
        hash: {
            type: String,
        },
        username: {
            type: String,
            unique: true,
            required: true,
        },
        cart: {
            items: [
                {
                    productId: {
                        type: Schema.Types.ObjectId,
                        ref: 'Product',
                        required: true
                    },
                    quantity: {type: Number, required: true}
                }
            ],
            price: {
                type: Number,
                required: true,
                unique: true,
                default: 0
            }
        },
        provider: {
            type: String,
            required: true,
            enum: ['local', 'google', 'facebook'],
            default: 'local'
        },
        orders: [
            {
                orderId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Order',
                    required: true
                }
            }
        ]
    },
    {timestamps: true}
);

//search for a users email and if they exist we return the user else we create a user.
UserSchema.methods.findOrCreate = async function () {
    try {
        await dbConnect();
        const userEmailExists = await mongoose.models.User.findOne({email: this.email});

        if (userEmailExists) {
            return userEmailExists;
        }

        return this.save();
    } catch (err) {
        return err;
    }
};

// Compare the password of an already fetched user (using `findUser`) and compare the
// password for a potential match
UserSchema.methods.validatePassword = async function (password) {
    const {hash} = await hashSalt(password, this.salt);
    const passwordsMatch = this.hash === hash;
    return passwordsMatch;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);

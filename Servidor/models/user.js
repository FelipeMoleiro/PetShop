//Felipe Guilermmo Santuche Moleiro - 10724010

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    imgPath: {
        type: String,
        required: true,
        default: 'uploads/profileImgs/default-user-image.png'
    },
    admin: {
        type: Boolean,
        default: false
    },
    pets: [{
        name: {
            type: String,
            required: true
        },
        imgPath: {
            type: String,
            required: true,
            default: 'uploads/petImgs/default-pet.jpg'
        },
        animal: {
            type: String,
            required: true
        },
        breed: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        }
    }],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
});

module.exports = mongoose.model('User', schema)
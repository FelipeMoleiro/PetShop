//Felipe Guilermmo Santuche Moleiro - 10724010

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    //id ja existe
    name: {
        type: String,
        required: true,
        trim: true
    },
    imgPath: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity_stock: {
        type: Number,
        required: true
    },
    quantity_sold: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Product', schema)
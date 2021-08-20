//Felipe Guilermmo Santuche Moleiro - 10724010

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: [true, 'O título é obrigatório'],
        trim: true,
        unique: true
    },
    price: {
        type: Number,
        required: [true, 'O preço é obrigatório']
    },
    hours: [{
        type: String,
        required: true
    }],
    days: [{
        type: String,
        required: true
    }],
    sold: {
        type: Number,
        default: 0
    },
    scheduled: [{
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String,
            required:true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required:true
        },
        animalId: {
            type: mongoose.Schema.Types.ObjectId,
            required:true
        }
    }]
});


module.exports = mongoose.model('Service', schema)
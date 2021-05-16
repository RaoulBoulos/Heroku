const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);

const Schema = mongoose.Schema;
const Currency = mongoose.Types.Currency;

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    averagePrice: {
        type: String,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Restaurants = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurants;
const mongoose = require('mongoose');

const { Schema } = mongoose;

const jsonSchema = new Schema({
    body: {type: Object, required: false},
    timestamp: {type: Date, default: Date.now}
});


module.exports = mongoose.model('Json', jsonSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// Add username, hash & salt fields and utility methods
userSchema.plugin(passportLocalMongoose);

// Export the model
module.exports = mongoose.model("User", userSchema);
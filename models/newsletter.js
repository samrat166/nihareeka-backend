const mongoose = require('mongoose');
const newsletterSchema = new mongoose.Schema({
   
    email:{
        type: String,
        required:[true, "Please enter Your Email"],
        unique: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      }
   
})

module.exports = mongoose.model("Newsletter", newsletterSchema);
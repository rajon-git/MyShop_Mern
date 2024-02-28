const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var enquerySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    comment:{
        type:String,
        required:true,
    },
    status: {
        type: String,
        default: "Submitted",
        enum: ["Submitted", "Contacted", "In progress"]
    }
});

//Export the model
module.exports = mongoose.model('Enquiry', enquerySchema);
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default:0,
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisLiked: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
       }
    ],
    disLikes: [
        {
          type:mongoose.Schema.Types.ObjectId,
          ref: "User"
       }
    ],
    image: {
        type: String,
        default:
            "https://www.shutterstock.com/image-photo/bloggingblog-concepts-ideas-white-worktable-600nw-1029506242.jpg"
    },
    author: {
        type : String,
        default :"Admin"
    }
},{
    toJSON: {
        virtuals:true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);
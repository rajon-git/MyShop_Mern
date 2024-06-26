const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    shippingInfo : {
        firstName: {
            type: String,
            required: true
           
        },
        lastName: {
            type: String,
            required: true
           
        },
        country: {
            type: String,
            required: true
           
        },
        city: {
            type: String,
            required: true
           
        },
        state: {
            type: String,
            required: true
           
        },
        other: {
            type: String,
            required: true
           
        },
        pincode: {
            type: Number,
            required: true
           
        }
    },
    // paymentInfo: {
    //     razorpayOrderId: {
    //         type:String,
    //         required:true
    //     },
    //     razorpayPaymentId: {
    //         type:String,
    //         required:true
    //     }
    // },
    paymentInfo: {
        method: {
            type: String,
            enum: ["cash_on_delivery", "online_payment"], // Add more payment methods if needed
            required: true
        },
    },
    orderItems: [
        {
            product: {
                type:mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required:true
            },
            color: {
                type:mongoose.Schema.Types.ObjectId,
                ref: "Color",
                required:true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    paidAt: {
        type:Date,
        default: Date.now()
    },
    month : {
        type: String,
        default: new Date().getMonth()
    },
    totalPrice: {
        type: Number,
        required: true
    },
    totalPriceAfterDiscount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type:String,
        default: "Ordered"
    }
},
{
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);
const Razorpay = require("razorpay");
const instance = new Razorpay({
    key_id:"",key_secret:""
})

const checkout = async(req,res)=>{
    const option = {
        amount : 5000,
        currency : 'INR'
    }
    const order = await instance.orders.create(option)
    res.json({
        success:true,
        order
    })
}

const paymentVerification = async(req,res)=>{
    const {razorpayOrderId,razorpayPaymentId} = req.body;
   
    res.json({
        razorpayOrderId,razorpayPaymentId
    })
}

module.exports={
    checkout,
    paymentVerification
}
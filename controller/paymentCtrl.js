const Razorpay = require("razorpay");
const instance = new Razorpay({
    key_id:"rzp_test_6ETWefW4U9ymSd",key_secret:"guuxsmJ5mKAJVKIKMdsp3Rra"
})

const checkout = async(req,res)=>{
    const option = {
        amount : amount,
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
// not Found
const notFound = (res,req,next)=>{
    const error = new Error(`Not Found: ${req.originalUrl}`);
    res.staus(404);
    next(error);
}

// Error Handler

const errorHandler = (err, req, res, next) => {
    const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statuscode);
    res.json({
      status: "fail",
      message: err?.message,
      stack: err?.stack,
    });
  };
  
  module.exports = { errorHandler, notFound };
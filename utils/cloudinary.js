const cloudinary = require("cloudinary");
const retry = require('retry');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET_KEY,
});

const cloudinaryUploadImg = async (fileToUploads) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      fileToUploads,
      {
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            asset_id: result.asset_id,
            public_id: result.public_id
          });
        }
      }
    );
  });
};


const cloudinaryDeleteImg = async (fileToDelete) => {
  const operation = retry.operation();

  return new Promise((resolve, reject) => {
    operation.attempt(() => {
      cloudinary.v2.uploader.destroy(
        fileToDelete,
        { resource_type: "image" },
        (error, result) => {
          if (error) {
            if (operation.retry(error)) {
              console.error("Retrying Cloudinary deletion:", error);
              return;
            }
            console.error("Cloudinary deletion failed after retries:", error);
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              asset_id: result.asset_id,
              public_id: result.public_id,
            });
          }
        }
      );
    });
  });
};

module.exports = {cloudinaryUploadImg,cloudinaryDeleteImg}

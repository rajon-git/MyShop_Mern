const multer = require("multer");
const imagemagick = require("imagemagick");
const path = require("path");
const fs = require("fs");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb({
      message: "Unsupported file format",
    }, false);
  }
};

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 },
});

// const productImgResize = async (req, res, next) => {
//   if (!req.file) return next();
//   await Promise.all(
//     req.files.map(async (file) => {
//       await imagemagick.resize({
//         srcPath: file.path,
//         dstPath: `public/images/products/${file.filename}`,
//         fs.unlinkSync(`public/images/products/${file.filename}`),
//         width: 300,
//         height: 300,
//       });
//     })
//   );
//   next();
// };
const productImgResize = async (req, res, next) => {
  if (!req.files) return next();

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const outputPath = `public/images/products/${file.filename}`;
        
        // Resize image
        await imagemagick.resize({
          srcPath: file.path,
          dstPath: outputPath,
          width: 300,
          height: 300,
        });

        // Check if the resizing was successful before attempting to delete
        if (fs.existsSync(outputPath)) {
          // Delete original file
          fs.unlinkSync(file.path);
        }
      })
    );

    next();
  } catch (error) {
    console.error('Error resizing and deleting files:', error);
    next(error); // Pass the error to the next middleware
  }
};


const blogImgResize = async (req, res, next) => {
  if (!req.file) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await imagemagick.resize({
        srcPath: file.path,
        dstPath: `public/images/blogs/${file.filename}`,
        width: 300,
        height: 300,
      });
    })
  );
  next();
};

module.exports = { uploadPhoto, productImgResize, blogImgResize };

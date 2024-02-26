const Brand = require("../model/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBrand = asyncHandler(async (req, res) => {
    try {
      const newBrand = await Brand.create(req.body);
      res.json(newBrand);
    } catch (error) {
      throw new Error(error);
    }
  });

  const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
      const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(updatedBrand);
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getallBrand,
  };
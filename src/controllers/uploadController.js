const Supplier = require("../models/supplier.model");
const { HTTPStatusCode } = require("../constants");
const User = require("../models/users.model");
const uploadServices = require("../services/upload.services");
const { getPublicIdFromUrlCloud } = require("../utilities/func");

const uploadController = {
  uploadAvatarImage: async (req, res) => {
    try {
      const { data } = req.infoUser;
      const findUser = await User.findById(data.id);
      if (!findUser) {
        return res.status(HTTPStatusCode.NOT_FOUND).json("Not found user");
      }
      uploadServices.deleteFile(getPublicIdFromUrlCloud(findUser.photo));
      const updateAvtUser = await User.findByIdAndUpdate(
        data.id,
        {
          photo: req.file.path,
        },
        { new: true }
      );
      const { password, username, __v, _id, ...updateInfo } =
        updateAvtUser._doc;
      updateInfo.id = Number(data.id);
      return res.status(HTTPStatusCode.OK).json(updateInfo);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
  uploadSupplierImage: async (req, res) => {
    try {
      const { id } = req.params;
      const findSupply = await Supplier.findById(id);
      if (!findSupply) {
        return res.status(HTTPStatusCode.NOT_FOUND).json("Not found supplier");
      }
      uploadServices.deleteFile(getPublicIdFromUrlCloud(findSupply.photo));
      const updateSupplier = await Supplier.findByIdAndUpdate(
        id,
        {
          photo: req.file.path,
        },
        { new: true }
      );
      return res.status(HTTPStatusCode.OK).json(updateSupplier);
    } catch (err) {
      console.log(err);
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = uploadController;

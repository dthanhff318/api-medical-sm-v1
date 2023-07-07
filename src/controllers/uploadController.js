const { HTTPStatusCode } = require("../constants");
const User = require("../models/users.model");

const uploadController = {
  uploadAvatarImage: async (req, res) => {
    try {
      const { data } = req.infoUser;
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
      return res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  },
};

module.exports = uploadController;

import { sanitizeUser } from "../index.js";
import userModel from "../model/userModel.js";

export const fetchUserInfo = async (req, res) => {
  try {
    const { id } = req.user;
    let user = await userModel.findById(id);
    res.status(200).json({email:user.email , role:user.role, addresses:user.addresses});
  } catch (err) {
    res.status(400).json(err);
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.user;
    let user = await userModel.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-password")
    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

import cartModel from "../model/cartModel.js";

export const addToCart = async (req, res) => {
  try {
    const {id} = req.user;
    const cartItem = await new cartModel({...req.body,user:id}).save();
    const result = await cartItem.populate("product");
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartItems = await cartModel
      .find({ user: id })
      // .populate("user")
      .populate("product");
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateCart = async (req, res) => {
  let result = await cartModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  try {
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const deleteCart = async (req, res) => {
  let result = await cartModel.findByIdAndDelete(req.params.id);
  try {
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

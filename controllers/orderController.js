import orderModel from "../model/orderModel.js";

export const createOrder = async (req, res) => {
  const {id} = req.user;
  try {
    const cartItem = await new orderModel({...req.body , user: id}).save();
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const fetchAllOrders = async (req, res) => {
  let query = orderModel.find({});
  let query2 = query.clone();
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }
  if (req.query._page && req.query._limit) {
    const limit = req.query._limit;
    const page = req.query._page;
    query = query.skip(limit * (page - 1)).limit(limit);
  }
  try {
    const result = await query.exec();
    const totalCount = await query2.countDocuments();
    res.set("X-Total-Count", totalCount);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const fetchUserOrders = async (req, res) => {
  const { id } = req.user;
  let userOrders = await orderModel.find({user:id});
  try {
    res.status(200).json(userOrders);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateOrder = async (req, res) => {
  const result = await orderModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  try {
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

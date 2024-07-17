import productModel from "../model/productModel.js";

//req.query gives object containing the string parameters  (after ? mark)
export const fetchCategories = async (req, res) => {
  let query = productModel.find({});
  query = query.distinct("category");
  try {
    let categories = await query.exec();
    categories = categories.map((category, index) => ({
      value: category,
      label: category,
      checked: false,
      indexId: index + 1,
    }));
    res.set("X-Total-Count", categories.length);
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
};

import productModel from "../model/productModel.js";

//req.query gives object containing the string parameters  (after ? mark)
export const fetchBrands = async (req, res) => {
  let query = productModel.find({});
  query = query.sort({ price: "asc" });
  query = query.distinct('brand');

  try {
    let brands = await query.exec();
    brands = brands.map((brand) => ({
      value: brand,
      label: brand,
      checked: false,
    }));
    res.set("X-Total-Count", brands.length);
    res.status(200).json(brands);
  } catch (err) {
    res.status(400).json(err);
  }
};

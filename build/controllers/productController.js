import productModel from "../model/productModel.js";

export const createProduct = async (req, res) => {
  const product = new productModel(req.body);
  product
    .save()
    .then((doc) => {
      res.status(201).json(doc); // TO TELL USER
    })
    .catch((err) => {
      res.status(400).json(err); // TO TELL USER
    });
};

//req.query gives object containing the string parameters  (after ? mark)
export const fetchProducts = async (req, res) => {
  const {role} = req.user;
  let query = (role=="admin" ? productModel.find({}) : productModel.find({deleted:{$ne:true}}));
  let sortCriteria = { indexId : "asc" };
  if (req.query.category) {
    query = query.find({ category: {$in:req.query.category.split(',')} });
  }
  if (req.query.brand) {
    query = query.find({ brand: {$in:req.query.brand.split(',')} });
  }
  if (req.query._sort && req.query._order) {
    sortCriteria = { [req.query._sort]: req.query._order};
  }
  query = query.sort(sortCriteria);

  let query2 = query.clone();
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

export const fetchProductById = async (req, res) => {
  let query = productModel.findById(req.params.id);
  try {
    const result = await query.exec();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

export const updateProduct = async (req, res) => {
  let query = productModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  try {
    const result = await query.exec();
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

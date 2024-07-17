import mongoose from "mongoose";
import autoIncrement from "mongoose-sequence";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    min: [0.00001, "Price should be > 0"],
    max: [20000, "Price should be <= 10000"],
    required: true,
  },
  discountPercentage: {
    type: Number,
    min: [0, "Percentage should be >= 0"],
    max: [99, "Percentage should be < 100"],
    required: true,
  },
  rating: {
    type: Number,
    min: [0, "Rating should be >= 0"],
    max: [5, "Rating should be <= 5"],
    required: true,
  },
  stock: {
    type: Number,
    min: [0, "Stock should be >= 0"],
    required: true,
  },
  brand: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  }
});

productSchema.virtual("id").get(function() {
  return this._id;
});
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

productSchema.plugin(autoIncrement(mongoose), { inc_field: 'indexId' });

export default mongoose.model("Product", productSchema);

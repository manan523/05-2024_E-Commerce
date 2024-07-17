import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  product : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
  },

});

cartSchema.virtual("id").get(function () {
  return this._id;
});
cartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default mongoose.model("Cart", cartSchema);

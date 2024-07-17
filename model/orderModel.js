import mongoose from "mongoose";
import autoIncrement from "mongoose-sequence"

const orderSchema = new mongoose.Schema({
  items : {
    type: [mongoose.Schema.Types.Mixed],
    required:true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  totalItems : {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  paymentMethod: {
    type:String,
    required: true
  },
  shippingAddress: {
    type:mongoose.Schema.Types.Mixed,
    required: true
  },
  status: {
    type:String,
    default:"Pending",
    required:true
  }
});

orderSchema.plugin(autoIncrement(mongoose), { inc_field: 'orderId' });

orderSchema.virtual("id").get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export default mongoose.model("Order", orderSchema);

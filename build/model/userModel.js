import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: Buffer,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    required: true
  },
  addresses: {
    type: [mongoose.Schema.Types.Mixed]
  },
  salt: Buffer
});

userSchema.virtual("id").get(function() {
  return this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});
userSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

export default mongoose.model("User", userSchema);

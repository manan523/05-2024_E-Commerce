import { sanitizeUser } from "../index.js";
import userModel from "../model/userModel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const SECRET_KEY = "SECRET_KEY";

export const createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      31000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new userModel({
          ...req.body,
          password: hashedPassword,
          salt,
        });
        const doc = await user.save();
        console.log(doc);
        const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
        res
          .cookie("jwt", token, { maxAge: 36000000, httpOnly: true })
          .status(201)
          .json(token);
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).json(err, {message: "Error Creating User"});
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "No such User Email" });
    } else {
      crypto.pbkdf2(
        password,
        user.salt,
        31000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (crypto.timingSafeEqual(user.password, hashedPassword)) {
            const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
            return res
              .cookie("jwt", token, {
                maxAge: 36000000,
                httpOnly: true,
              })
              .status(201)
              .json(token);
          } else {
            return res.status(401).json({ message: "Invalid Credentials" });
          }
        }
      );
    }
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
};

export const checkAuth = async (req, res) => {
  if(req.user){
    res.json(req.cookies["jwt"]);
  }
  else{
    res.status(401);
  }
};

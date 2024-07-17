import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productRouter from "./routes/productRoutes.js";
import brandRouter from "./routes/brandRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import passport from "passport";
import userModel from "./model/userModel.js";
import { Strategy as JwtStrategy } from "passport-jwt";
import cookieParser from "cookie-parser";
import path from "path";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const __dirname = path.resolve();
const SECRET_KEY = process.env.TSK;
const app = express();

app.use(express.static("build"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
var cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};
var opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;
{
  // CONTAINS COMMENTS ABOUT SESSION PART
  // If I use only JWT for auth and session management,  instead of express-session,
  // I will have to verify token for each request and determine if it has expired or
  // not, and then process the request , maybe renew the token also.
  // If I use only express-session , the server will first verify if a session already
  // exists using the sent session cookie , else will compare the credentials and
  // pass it to serialiser (if passport) else in req.session.something
  // If I use JWT with session , a session validates at the start if already a session
  // exists and assigns a token , then the authentication part is handled by JWT tokens and user info is appended.
  // app.use(
  //   session({
  //     secret: "keyboard cat",
  //     resave: false, // don't save session if unmodified
  //     saveUninitialized: false, // don't create session until something stored
  //   })
  // );
  // app.use(passport.authenticate("session"));
  // passport.use(
  //   "local",
  //   new LocalStrategy({ usernameField: "email" }, async function (
  //     email,
  //     password,
  //     done
  //   ) {
  //     try {
  //       let user = await userModel.findOne({ email });
  //       if (!user) {
  //         done(null, false, { message: "No such user Email" });
  //       } else {
  //         crypto.pbkdf2(
  //           password,
  //           user.salt,
  //           31000,
  //           32,
  //           "sha256",
  //           async function (err, hashedPassword) {
  //             if (crypto.timingSafeEqual(user.password, hashedPassword)) {
  //               const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
  //               done(null, { token }); //this line sends the user object to serialiser
  //             } else {
  //               done(null, false, { message: "Invalid Credentials" });
  //             }
  //           }
  //         );
  //       }
  //     } catch (err) {
  //       done(err);
  //     }
  //   })
  // );
  // passport.serializeUser(function (user, cb) {
  //   console.log("serialise", user);
  //   process.nextTick(function () {
  //     return cb(null, user);
  //   });
  // });
  // passport.deserializeUser(function (user, cb) {
  //   console.log("de-serialise", user);
  //   process.nextTick(function () {
  //     return cb(null, user);
  //   });
  // });
}
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await userModel.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user));
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

export function sanitizeUser(user) {
  return { id: user.id, role: user.role };
}
export function isAuth(req, res, done) {
  return passport.authenticate("jwt", { session: false });
}

app.use("/api/products", isAuth(), productRouter);
app.use("/api/brands", isAuth(), brandRouter);
app.use("/api/categories", isAuth(), categoryRouter);
app.use("/api/users", isAuth(), userRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", isAuth(), cartRouter);
app.use("/api/orders", isAuth(), orderRouter);
app.get("/api", (req, res) => {
  res.json({ status: "success" });
});
//PAYMENTS
const stripe = Stripe(process.env.SSK);

app.post("/api/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "usd",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});


mongoose
  .connect(process.env.DB_URL)
  .then(async () => {
    app.listen(process.env.PORT, () => {
      console.log(`SERVER LISTENING ON PORT ${process.env.PORT}`);
    });

    // await mongoose.connection.dropCollection("products");
    // data.products.map((product) => {
    //   fetch("/api/products", {
    //     method: "POST",
    //     body: JSON.stringify({...product,indexId:product.id}),
    //     headers: { "content-type": "application/json" },
    //   });
    // });
    // console.log("data inserted");
  })
  .catch((err) => {
    console.log(err + "\nConnection Unsuccessful");
  });

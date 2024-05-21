import express from "express";
import mongoose from "mongoose";
import { userModel } from "./Models/User.js";
import path from "path";
const app = express();
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: "drftah0vo",
  api_key: "777824139827695",
  api_secret: "IXDiQMrhj98sdVfrOUwB8ZWY27k",
});

app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const port = 3000;

//connection with database
mongoose
  .connect(
    "mongodb+srv://maulikprajapati722004:stkzsIdmPaBhSHcr@cluster0.uud1es4.mongodb.net/",
    {
      dbName: "Nodejs_express",
    }
  )
  .then(() => {
    console.log("MongoDB Connected ");
  })
  .catch((err) => {
    console.log(err);
  });

//show register page
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

//show login page
app.get("/", (req, res) => {
  res.render("login.ejs");
});

//create user
app.post("/register", upload.single("file"), async (req, res) => {
  const file = req.file.path;
  const { name, email, password } = req.body;

  try {
    const cloudinaryReponce = await cloudinary.uploader.upload(file, {
      folder: "Nodejs_Authentication_App",
    });

    let user = await userModel.create({
      profileImg: cloudinaryReponce.secure_url,
      name,
      email,
      password,
    });

    res.redirect("/");

    console.log(cloudinaryReponce, name, email, password);
  } catch (error) {
    res.send("error occur");
  }
});

//login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    console.log(user);

    if (!user) {
      res.render("login.ejs", { message: "User Not Found" });
    } else if (user.password !== password) {
      res.render("login.ejs", { message: "Invalid Password" });
    }else{
        res.render("profile.ejs",{user})
    }
  } catch (error) {
    res.send("error occur")
  }
});

//all users

app.get("/users",async(req,res)=>{
   let users  = await userModel.find({}).sort({createdAt:-1});
   res.render("users.ejs",{users})
    
})



app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});

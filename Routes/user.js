const express = require("express");
const User = require("../Models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isAuth = require("../Midellwaires/isAuth");
const isAdmin = require("../Midellwaires/isAdmin");
const cloudinary = require("../Utils/cloudinary");
const generateCode = require("../Utils/GenerateCode");
const nodemailer = require("nodemailer");
const { isValid } = require("../Midellwaires/isValid");


// register
//http://localhost:8000/user/register
router.post("/register",async (req, res) => {
  let { name, email, password, role , phone , address , image} = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: "user already exist" });
      return;
    }
    const hashPassword = await bcrypt.hash(password, 10);
    req.body.password = hashPassword;
    user = new User(req.body);
    if(image){
      const uploadRes =  await cloudinary.uploader.upload(image , {
           upload_preset:"online-librairie"
       })
      const {public_id, secure_url} = uploadRes
      user.image = {public_id, secure_url}}
    await user.save();
    const token = await jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
    res.status(201).json({token ,user});
  } catch (error) {
    res.status(404).json({message:error.message});
  }
});
//  login 
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "7 days",
    })
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// getting the auth user
router.get("/auth", isAuth, (req, res) => {
  try {
    const user = res.user;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({message:error.message});
  }
});
router.get("/profile" ,isAuth, async (req , res) => {
  try {
    const user = res.user ;
    res.status(200).json(user);
    
  } catch (error) {
    res.status(500).json({message:error.message});
    
  }
  });

  // getting all user
router.get("/allUsers" ,isAuth, isAdmin, async (req ,res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
    
  } catch (error) {
    res.status(500).json({message:'can not get user'})
  }
});

// updating user

router.put("/update", isAuth , async(req, res) => {
  const id = res.user._id
  const {email, name,password, phone , address,image} = req.body
  try {
    const user = await User.findById(id)
    const hashPassword = await bcrypt.hash(password, 10);
    user.email = email || user.email
    user.name =name || user.name
    user.phone =phone || user.phone
    user.address =address || user.address
    user.password =hashPassword || user.password
    if(image){
      const uploadRes =  await cloudinary.uploader.upload(image , {
           upload_preset:"online-librairie"
       })
      const {public_id, secure_url} = uploadRes
      user.image = {public_id, secure_url}
  
    await user.save()
      }
    res.status(200).json({message:'user updated with success'})
  } catch (error) {
    res.status(500).json({message:error.message})
  }
});
// forgot password
router.post("/forgot" , async (req, res)=>{
  try {
    const {email} = req.body
    const olduser = await User.findOne({email})
    if(!olduser) return res.status(404).json({ message: "user not found" });
    const code = generateCode()
    let Transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
          user: "nizarzahmouli351@gmail.com",
          pass: process.env.NODE_MAILER_PASSWORD
      }
  });
    const mailOption = {
      from : "services technique",
      to : email,
      subject : "rest your Password",
      text : ` hello ${olduser.username} please copy this code to restore your password : ${code}`,
    }

    Transport.sendMail(mailOption, function(error, info) {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
    
    const hashedCode= await bcrypt.hash(code, 8)
    olduser.code  =  hashedCode
    console.log(hashedCode , olduser.code)
    
    await olduser.save();
    res.status(200).json({ message: "check youremail ", userID: olduser._id});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

})
// validation code
router.post('/:userID/validate-code',isValid , async (req, res) => {
  const user = res.user
  try {
    const token = jwt.sign({ userid: user._id }, process.env.JWT_KEY, {
      expiresIn: "5 minutes"})

    res.status(200).json(token);
  } catch (error) {
    
  }
})
// update password
router.put("/update-password/:userID", isAuth, async (req, res) => {
  const id = req.params.userID
  const {password}  = req.body;
  try {
    const user = await User.findById(id);
    console.log(user)
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword 
    await user.save();
    res.status(200).json({ message: "password updated successfully",user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;

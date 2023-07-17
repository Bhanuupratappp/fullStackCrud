const express = require("express")
const router = express.Router()
const {User} = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")



router.post("/register", async (req,res)=>{
    try{
        const {name,email,gender,password} = req.body

        const user = await User.findOne({email})
        if(user){
            return res.json({message: "User already exists, please login"})

        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newuser = await User.create({name,email,gender,password:hashedPassword})

        res.status(201).json(newuser)
    }
    catch(err){
        res.status(500).json({message: 'Error'})
    }
})


router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const userPresent = await User.find({ email });
  
      if (userPresent.length === 0) {
        return res.json("User is not present");
      }
  
      const check = await bcrypt.compare(password, userPresent[0].password);
      if (!check) {
        return res.json("Invalid credentials");
      }
  
      const token = jwt.sign({ userId: userPresent[0]._id }, process.env.secret);
      res.json({ email, token });
    } catch (err) {
      res.status(500).json({ message: 'Error' });
    }
  })

module.exports = router
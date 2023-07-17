const express = require("express")
const router = express.Router()

const jwt = require("jsonwebtoken")
const {Post} = require("../models/postModel")





const middleware = async (req,res,next) =>{
    const token = req.header('Authtoken')
    if(!token){
        return res.status(401).json({message:"No token provided."})
    }
    try{
        let decoded = jwt.verify(token,process.env.secret)
        req.userId = decoded.userId
        next()
    }
    catch(err){
        res.status(401).json({message: 'Authorization denied. Invalid token.'})
    }
}  

router.post("/create",middleware,async (req,res)=>{
    try{
        let {title, body, device} = req.body
        const obj={
            title,
            body,  
            device,
            author:req.userId

        }
        const post = await Post.create(obj)
        res.status(201).json({post})
    }
    catch(err){
        res.status(500).json({message:'Error'})
    }
})
router.get("/",middleware,async  (req,res)=>{
    try{
        const {device, page} = req.query
        let skip;
        if(page)
        skip = (page - 1)*3
        else
        skip = 0

        let query = {author: req.userId}
        if(device){
            query.device = device
        }

        const postdata = await Post.find(query).skip(skip).limit(3)
        res.status(200).json(postdata)
    }
    catch(err){
        res.status(500).json({message:"Error"})
    }
})
router.patch("/update/:id",middleware,async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        if(!post)
        res.send("post not found")

        if(post.author.toString()!==req.userId)
        res.send("Not authorised")

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body,{new:true})
        res.status(200).send(updatedPost)
    }
    catch(err){
        res.status(500).json({message: 'Update-Error'})
    }
})
router.delete("/delete/:id",middleware,async (req,res)=>{
    try{
        const post = await Post.findByid(req.params.id)
        console.log(post)
        if(!post)
        res.send("post not found")

        if(post.author.toString()!==req.userId)
        res.send("Not authorised")

        const deletedPost = await Post.findByIdAndDelete(req.params.id)
        res.status(200).send("post deleted")
    }
    catch(err){
        res.status(500).json({message:'Delete-Error'})
    }
})

module.exports = router

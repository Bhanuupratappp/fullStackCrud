const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
require("dotenv").config()
app.use(express.json())
app.use(cors())

const userRouter = require("./routes/userRoutes")
const postRouter = require("./routes/postRoutes")

const username = 'bhanuupratapp'
const password = 'bhanu'

const connection = async ()=>{
    try{
        await mongoose.connect(process.env.mongo_url)
        // await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.vqbnihy.mongodb.net/bahubali?retryWrites=true&w=majority`)
        console.log("connected")
    }
    catch(err){
        console.log(err)
    }
}

app.use("/user",userRouter)
app.use("/post", postRouter)

app.listen(8080,()=>{
    connection()
    console.log("on port 8080 now")
})
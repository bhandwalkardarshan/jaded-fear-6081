const express = require("express")
const cors = require("cors")
const {connection} = require("./db")
const {userRoutes} = require("./routes/user.routes")
const {postRoutes} = require("./routes/post.routes")
const {authentication} = require("./middleware/authentication")
require("dotenv").config()
const app = express()
app.use(express.json())
app.use(cors())

app.use("/users",userRoutes)

app.use("/posts",authentication)
app.use("/posts",postRoutes)


app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("Connected to mongo db server")
    }
    catch(err){
        console.log(err)
    }
    console.log(`Connected to server at port ${process.env.port}`)
})
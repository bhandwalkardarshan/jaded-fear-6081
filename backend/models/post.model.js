const mongoose = require("mongoose")
/*title ==> String
body ==> String
device ==> String
no_of_comments ==> Number
*/
const postSchema = mongoose.Schema({
    title:{type:String,required:true},
    body:{type:String,required:true},
    device:{type:String,required:true,enum:["Laptop", "Tablet", "Mobile"]},
    no_of_comments:{type:Number,required:true},
    userId:{type:String,required:true}
})

const PostModel = mongoose.model("post",postSchema)

module.exports = {PostModel}
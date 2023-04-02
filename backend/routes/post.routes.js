const express = require("express")
const mongoose = require("mongoose")
const postRoutes = express.Router()
const {PostModel} = require("../models/post.model")

/*

/posts ==> This will show the posts of logged in users.
   - There should be a filter as well that can show the posts of single users (you can achieve this by handling queries)
   - Can also filter out the posts based on min and max comments passed as queries, should show posts with comments in between min and max comments
   - Only 3 posts should be visible per page (Apply Pagination)
/posts/top ==> This will show the post details that has maximum number of comments for the user who has logged in.
   - Only 3 posts should be visible per page (Apply Pagination)
/posts/update ==> The logged in user can update his/her posts.
/posts/delete ==> The logged in user can delete his/her posts.

Following functionalities should also be there.
1. If the device name is passed as query, then it should show only those posts from which device that post has been made.
 2. For Example, device=Mobile ==> will give mobile posts only for the user who has logged in.
3. device1=Mobile & device2=Tablet ==> will give the posts made by mobile and tablet for the user who has logged in. */
postRoutes.get("/",async(req,res)=>{
    let max=+req.query.max
    let min=+req.query.min
    let page=+req.query.page
    let id = req.query.id
    let lim=3
    let x = (page-1)*lim
    if(max && min && page){
        try{
            const {userId} = req.body
            const posts = await PostModel.find({userId})
            if(posts.length>0){
                const post = await PostModel.find({userId,no_of_comments:{$gt:min,$lt:max}}).skip(x).limit(lim)
                res.send(post)
            }
        }
        catch(err){
            res.send({"error":err.message})
        }
    }
    else if(id){
        try{
            const {userId} = req.body
            const posts = await PostModel.find({userId,_id:id})
            res.send(posts)
        }
        catch(err){
            res.send({"error":err.message})
        }
    }
    else if(page){
        try{
            const {userId} = req.body
            const posts = await PostModel.find({userId}).skip(x).limit(lim)
            res.send(posts)
        }
        catch(err){
            res.send({"error":err.message})
        }
    }
    
})

//device
postRoutes.get("/device",async(req,res)=>{
    let device=req.query.device
    try{
        const {userId} = req.body
        const posts = await PostModel.find({userId,device:device})
        res.send(posts)
    }
    catch(err){
        res.send({"error":err.message})
    }
})

//add post
postRoutes.post("/add",async(req,res)=>{
    try{
        const newpost = new PostModel(req.body)
        await newpost.save()
        res.send({"msg":"Post Created",post:newpost})
    }
    catch(err){
        res.send({"error":err.message})
    }
})

// post which have maximum number of comments
postRoutes.get("/top",async(req,res)=>{
    try{
        const post = await PostModel.find().sort({no_if_comments:-1}).limit(3)
        res.send({"msg":"Post having maximum number of comments",post:post})
    }
    catch(err){
        res.send({"error":err.message})
    }
})

// update posts
postRoutes.patch("/update/:id",async(req,res)=>{
    const id = req.params.id
    const payload = req.body
    try{
        let updated = await PostModel.findByIdAndUpdate({_id:id},payload)
        res.send({"msg":"Updated",post:updated})
    }
    catch(err){
        res.send({"error":err.message})
    }
})

// delete posts
postRoutes.patch("/delete/:id",async(req,res)=>{
    const id = req.params.id
    try{
        let updated = await PostModel.findByIdAndDelete({_id:id})
        res.send({"msg":"Deleted",post:updated})
    }
    catch(err){
        res.send({"error":err.message})
    }
})


module.exports = {postRoutes}
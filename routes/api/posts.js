const express=require('express');
const router=express.Router();
const auth=require('../../middlewares/auth');
const {check,validationResult}=require('express-validator');
const User=require('../../models/Users');
const Profile=require('../../models/Profile');
const Post=require('../../models/Posts');


//@route   POST api/posts
//@desc    CREATE POST
//@access  private
router.post('/',[auth,[
    check('text',"TEXT IS REQUIRED").not().isEmpty()]],
    async (req,res)=>{
        const error=validationResult(req);
        if(!error.isEmpty())
        {
            return res.status(400).json({error:error.array()});
        }
        try{
            const user=await User.findById(req.user.id).select('-password');
            const newPost=new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });
            const post= await newPost.save();
            res.json(post);

        }catch(error){
            console.log(error);
            res.status(500).json({error:'SERVER ERROR'});
        }

});

//@route   GET api/posts
//@desc    GET ALL POST
//@access  private

router.get('/',auth,async(req,res)=>{
    try{
        const posts= await Post.find().sort({date:-1});
        res.json(posts);
    }catch(error)
    {
        res.status(500).json({error:"SERVER ERROR"});
    }
});



//@route   GET api/posts/:id
//@desc    GET POST BY ID
//@access  private
router.get('/:id',auth,async(req,res)=>{
    try{
        const post= await Post.findById(req.params.id);
        if(!post)
        {
            return res.status(400).json({error:"POST NOT FOUND"});
        }
        res.json(post);
    }catch(error)
    {
        if(error.kind==='ObjectId')
        return res.status(400).json({error:"POST NOT FOUND"});

        res.status(500).json({error:"SERVER ERROR"});
    }
});


//@route   DELETE api/posts/:id
//@desc    DELETE POST BY ID
//@access  private
router.delete('/:id',auth,async(req,res)=>{
    try{
        const post= await Post.findById(req.params.id);
        if(!post)
        {
            return res.status(400).json({error:"POST NOT FOUND"});
        }
        if(post.user.toString()!== req.user.id)
        {
            return res.status(401).json({error:'USER NOT AUTHORIZED'});
        }
        await post.remove()
        res.json({msg:'POST DELETED'});
    }catch(error)
    {
        if(error.kind==='ObjectId')
        return res.status(400).json({error:"POST NOT FOUND"});

        res.status(500).json({error:"SERVER ERROR"});
    }
});



//@route   PUT api/posts/like/:id
//@desc    LIKE POST BY ID
//@access  private
router.put('/like/:id',auth,async(req,res)=>{
    try{
        const post= await Post.findById(req.params.id);
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0)
        {
            return res.status(400).json({error:"POST ALREADY LIKED"});
        }
        post.likes.unshift({user:req.user.id});
        await post.save();
        res.json(post.likes);
    }catch(error)
    {
        res.status(500).json({error:"SERVER ERROR"});
    }
});


//@route   PUT api/posts/unlike/:id
//@desc    UNLIKE POST BY ID
//@access  private
router.put('/unlike/:id',auth,async(req,res)=>{
    try{
        const post= await Post.findById(req.params.id);
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0)
        {
            return res.status(400).json({error:"POST HAS NOT YET LIKED"});
        }
        const removeIndex=post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex,1);
        await post.save();
        res.json(post.likes);
    }catch(error)
    {
        res.status(500).json({error:"SERVER ERROR"});
    }
});



//@route   POST api/posts/comment/:id
//@desc    COMMENT ON POST
//@access  private
router.post('/comment/:id',[auth,[
    check('text',"TEXT IS REQUIRED").not().isEmpty()]],
    async (req,res)=>{
        const error=validationResult(req);
        if(!error.isEmpty())
        {
            return res.status(400).json({error:error.array()});
        }
        try{
            const user=await User.findById(req.user.id).select('-password');
            const post= await Post.findById(req.params.id);
            const newComment={
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);
            await post.save();
            res.json(post.comments);

        }catch(error){
            res.status(500).json({error:'SERVER ERROR'});
        }

});


//@route   DELETE api/posts/comment/:id/:comment_id
//@desc    DELETE COMMENT
//@access  private
router.delete('/comment/:id/:comment_id',auth,async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        const comment=await post.comments.find(comment=>comment.id.toString()===req.params.comment_id);
        if(!comment)
        {
            return res.status(400).json({error:"COMMENT DOESN'T EXIST"});
        }
        if(comment.user.toString()!==req.user.id)
        {
            return res.status(401).json({error:"USER NOT AUTHORIZED"});
        }
        const removeIndex=post.comments.indexOf(req.params.comment_id);
        post.comments.splice(removeIndex,1);
        await post.save();
        res.json(post.comments);

    }catch(error){
        console.log(error)
        res.status(500).json({error:'SERVER ERROR'})
    }
});






module.exports=router;
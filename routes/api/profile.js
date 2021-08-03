const express=require('express');
const router=express.Router();
const auth=require('../../middlewares/auth');
const Profile=require("../../models/Profile");
const User=require('../../models/Users');
const Post=require('../../models/Posts');
const request = require('request');
const config=require('config');
const {check,validationResult}=require('express-validator');


//@route   GET  api/profile
//@desc    GET ALL PROFILES 
//@access  public

router.get('/',async (req,res)=>{
    try{
        let profiles=await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);

    }catch(error)
    {
        res.status(500).json({msg:"SERVER ERROR"});
    }
});


//@route   POST api/profile
//@desc    CREATE AND UPDATE PROFILE
//@access  private
router.post('/',[auth,[
    check('status','STATUS IS REQUIRED').not().isEmpty(),
    check('skills','SKILL IS REQUIRED').not().isEmpty()] ],
    async (req,res)=>{
        const error=validationResult(req);
        if(!error.isEmpty())
        {
            return res.status(400).json({errors:error.array()})
        }
        const {company,website,location,
            status,skills,bio,
            githubusername,instagram,twitter,
            facebook,linkedin,youtube}=req.body;

        const profileFields={};
        profileFields.user=req.user.id;
        if(company) profileFields.company=company;
        if(website) profileFields.website=website;
        if(location) profileFields.location=location;
        if(status) profileFields.status=status;
        if(bio) profileFields.bio=bio;
        if(githubusername) profileFields.githubusername=githubusername;
        if(skills){
            profileFields.skills=skills.split(',').map(skill=>skill.trim());
        } 
        profileFields.social={}
        if(instagram) profileFields.social.instagram=instagram;
        if(twitter) profileFields.social.twitter=twitter;
        if(linkedin) profileFields.social.linkedin=linkedin;
        if(youtube) profileFields.social.youtube=youtube;
        if(facebook) profileFields.social.facebook=facebook;

        try{
            let profile=await Profile.findOne({user:req.user.id});
            if(profile)
            {
                profile= await Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true});
                return res.json(profile);
            }
            profile=new Profile(profileFields);
            await profile.save();
            res.json(profile);
        }catch(error){
            res.status(500).json({msg:"SERVER ERROR"});
        }
        
    });

//@route   DELETE api/profile
//@desc    DELETE USER PROFILE
//@access  PRIVATE

router.delete('/',auth,async (req,res)=>{
    try{
        await Profile.findOneAndDelete({user:req.user.id});
        await User.findOneAndDelete({_id:req.user.id});
        await Post.deleteMany({user:req.user.id});
        res.json({msg:'USER DELETED'});

    }catch(error)
    {
        res.status(500).json({msg:"SERVER ERROR"});
    }
});


//@route   GET api/profile/me
//@desc    GET LOGGED IN USER PROFILE
//@access  private
router.get('/me',auth,async (req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
        if(!profile)
        {
            return res.status(400).json({msg:"THERE IS NO PROFILE FOR THIS USER"});
        }
        res.json(profile);
    }catch(err)
    {
        res.status(500).json({msg:"SERVER ERROR"});
    }
});

//@route   GET  api/profile/user/:user_id
//@desc    GET PROFILE USING ID
//@access  public

router.get('/user/:user_id',async (req,res)=>{
    try{
        let profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        if(!profile){
            res.status(400).json({msg:"PROFILE NOT FOUND"});
        }
        res.json(profile);

    }catch(error)
    {
        if(error.kind=='ObjectId')
        return res.status(400).json({msg:"PROFILE NOT FOUND"});
        res.status(500).json({msg:"SERVER ERROR"});
    }
});


//@route   PUT api/profile/experience
//@desc    PUT EXPERIENCE 
//@access  private
router.put('/experience',[auth,[
    check('title','TITLE IS REQUIRED').not().isEmpty(),
    check('company','COMPANY IS REQUIRED').not().isEmpty(),
    check('from','FROM IS REQUIRED').not().isEmpty()]],
    async(req,res)=>{
        const error=validationResult(req);
        if(!error.isEmpty())
        {
           return  res.status(400).json({errors:error.array()});
        }
        const { title,company,location,from,to,current,description}=req.body;
        const newExp={title,company,location,from,to,current,description};

        try{
            let profile= await Profile.findOne({user:req.user.id});
            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        }catch(err)
        {
            res.status(500).send("SERVER ERROR");
        }
        

    });


//@route   DELTE api/profile/experience/:exp_id
//@desc    DELETE EXPERIENCE
//@access  private
router.delete('/experience/:exp_id',auth, async(req,res)=>{
    try{
        let profile=await Profile.findOne({user:req.user.id});
        const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    }catch(err)
    {
        res.status(500).json({msg:"SERVER ERROR"});
    }
});

//@route   PUT api/profile/education
//@desc    PUT EDUCATION 
//@access  private
router.put('/education',[auth,[
    check('school','SCHOOL IS REQUIRED').not().isEmpty(),
    check('degree','DEGREE IS REQUIRED').not().isEmpty(),
    check('fieldofstudy','FIELDOFSTUDY IS REQUIRED').not().isEmpty(),
    check('from','FROM IS REQUIRED').not().isEmpty()]],
    async(req,res)=>{
        const error=validationResult(req);
        if(!error.isEmpty())
        {
            return res.status(400).json({errors:error.array()});
        }
        const { school,degree,fieldofstudy,from,to,current,description}=req.body;
        const newEdu={school,degree,fieldofstudy,from,to,current,description};

        try{
            let profile= await Profile.findOne({user:req.user.id});
            profile.education.unshift(newEdu);
            await profile.save();
            res.json(profile);
        }catch(error)
        {
            res.status(500).send("Server Error");
        }
        

    });

//@route   DELTE api/profile/education/:edu_id
//@desc    DELETE EDUCATION
//@access  private
router.delete('/education/:edu_id',auth, async(req,res)=>{
    try{
        let profile=await Profile.findOne({user:req.user.id});
        const removeIndex=profile.education.map(item=>item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    }catch(err)
    {
        res.status(500).json({msg:"SERVER ERROR"});
    }
});


//@route   GET api/profile/github/:github_username
//@desc    GET GITHUB REPORISOTRY
//@access  public

router.get('/github/:github_username',(req,res)=>{
    try{
        const option={
            uri :`https://api.github.com/users/${req.params.github_username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get('githubClientId')}
            &client_secret=${config.get('githubClientSecret')}`,
            method:'GET',
            headers:{'user-agent':'node.js'}
        }
        request(option,(error,response,body)=>{
            if(error)
            console.log(error);
            if(response.statusCode!==200)
            return res.status(400).json({error:'GITHUB REPOSITORY NOT FOUND'});
            res.json(JSON.parse(body));
        })
    }catch(error)
    {
        console.log(error);
        res.status(500).json({msg:"SERVER ERROR"});
    }
});



module.exports=router;
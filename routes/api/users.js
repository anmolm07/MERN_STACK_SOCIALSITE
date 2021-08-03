const express=require('express');
const router=express.Router();
const {check,validationResult}=require('express-validator');
const config=require('config')
const User=require('../../models/Users');
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


//@route   POST api/users
//@desc    Test route
//@access  public
router.post('/',[
    check('name','Name is Required').not().isEmpty(),
    check('email','Please Enter a Valid Email').isEmail(),
    check('password',"Minimum Length for Password is 8 Characters").isLength({min:8})],
    async (req,res)=>{
        const error=validationResult(req);
        if(!error.isEmpty())
        {
            return res.status(400).json({errors:error.array()});
        }
        const{name,email,password,avatar}=req.body;
        try{
            let user= await User.findOne({email});
            if(user)
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            if(!avatar)
            {
                const avatar1=gravatar.url(email,{
                    s:'200',
                    r:'pg',
                    d:'mm'
                });
                user=new User({
                    name,
                    email,
                    password,
                    "avatar":avatar1
                });
            }
            else
            {
                user=new User({
                    name,
                    email,
                    password,
                    avatar
                });
            }
            const salt=await bcrypt.genSalt(10);
            user.password=await bcrypt.hash(password,salt);
            await user.save();

            //Gonna return json webToken
            const payload = {
                user:{
                    id: user.id
                }
            };
            jwt.sign(payload,config.get('jwtSecret'),(err,token)=>{
                if(err){
                    throw err;
                }
                else{
                    res.json({
                        token
                    });
                }

            })

        }
        catch(error)
        {
            console.log(error);
            res.status(500).send("SERVER ERROR");
        }
    });

module.exports=router;
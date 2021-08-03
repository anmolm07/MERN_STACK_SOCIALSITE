const express=require('express');
const router=express.Router();
const User=require('../../models/Users');
const auth=require('../../middlewares/auth');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const {check,validationResult}=require('express-validator');
const config=require('config')


//@route   api/auth
//@desc    Test route
//@access  private
router.get('/',auth,async (req,res)=>{
    try{
        const user=await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.log(err);
        res.status(500).send("SERVER ERROR");
    }
});

//@route   Post api/auth
//@desc    Test route
//@access  public
router.post('/',[
    check('email','Please Enter a Valid Email').isEmail(),
    check('password',"Minimum Length for Password is 8 Characters").exists()],
    async (req,res)=>{
        const error=validationResult(req);
        if(!error.isEmpty())
        {
            return res.status(400).json({errors:error.array()})
        }
        const{email,password}=req.body;
        try{
            let user= await User.findOne({email});
            if(!user)
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] }); 
            const isMatch=await bcrypt.compare(password,user.password);
            if(!isMatch)
            {
                return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
            }
            
                

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
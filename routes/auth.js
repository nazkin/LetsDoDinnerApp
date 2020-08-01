const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validate } = require('express-validation');
const {signUpValidation, logInValidation} = require('../validation');


router.post('/register', validate(signUpValidation), async (req,res)=> {


    const emailExists = await User.findOne({email:req.body.email});
    if(emailExists){
        res.status(400).json({
            message: "Email already exists"
        });
    }
    //encrypting password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: passwordHash
    });

    try {
        const saveUser = await user.save();
        res.json({
            userId: saveUser._id
        });
    } catch (error) {
        res.ststus(400).json(error);
    }
});

router.post('/login',validate(logInValidation), async (req,res)=> {
    
    //Check log in info
    const userInfo  = await User.findOne({email: req.body.email});
    const validPass = await bcrypt.compare(req.body.password, userInfo.password);

    if(!userInfo || !validPass){
        res.status(400).json({
            message: "User information is incorrect"
        });
    }
    //Creating a token
    const token = jwt.sign({userId: userInfo._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).json({
        token: token,
        userId: userInfo._id
    });
   


});

module.exports = router;
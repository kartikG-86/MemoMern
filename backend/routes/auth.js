const express = require('express')
const User = require('../models/User'); 
const router = express.Router()
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')
const {body,validationResult} = require('express-validator')

const fetchuser = require('../middleware/fetchuser')
const secret = "kudshfldsslaffbknnlsdf"

// new User Created
router.post('/createUser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
  ],async (req,res)=>{

    try{

            // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
        return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }
        
        const salt = await bcrypt.genSalt(10)
        securePassword = await bcrypt.hash(req.body.password,salt)
         user = await User.create({
            name:req.body.name,
            password:securePassword,
            email:req.body.email
        })

        const userdata  = {
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(userdata,secret)
        res.json({authToken})
    } catch(error){
        console.error(error.message)
    }

    
})


// User Login

router.post('/login',  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ],async(req,res) => {
    try{

        let user = await User.findOne({email: req.body.email});
        if (!user){
          return res.status(400).json({error:"Please try to login with correct Credentials"})
        }

        const passwordCheck = await bcrypt.compare(req.body.password,user.password)
        if(!passwordCheck){
            return res.status(400).json({error:"Please try to login with correct Credentials"})
        }

        const userdata  = {
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(userdata,secret)
        res.json({authToken})

    } catch(error){
        console.log(error.message)
    }
})

// fetch User details

router.post('/getuser', fetchuser, async (req,res) => {

    try{
        const userid = req.user.id;
        console.log(userid)
        let user = await User.findById(userid)
        console.log(user)
        res.send(user)

    }catch(error){
        console.log(error.message)
    }
})

module.exports = router
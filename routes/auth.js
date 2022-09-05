const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { nameValidation, cinValidation, emailValidation, passwordValidation, validator, isAuthenticated } = require('./middlewares')
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

//REGISTER
router.post("/register", nameValidation, cinValidation, emailValidation, passwordValidation , validator, async (req, res) => {
const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    cin: req.body.cin,
    password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASSWORD_SECRET
    ).toString(),
    phoneNumber: req.body.phoneNumber,  
    address: req.body.address,
    userType: req.body.userType, 
    isVerified: req.body.userType === "admin" ? true : false
});
try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
} catch (err) {
    console.log(err)
    res.status(500).json(err);
}
}); 

//LOGIN
router.post("/login/:userType", validator, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });   
        !user && res.status(401).json("Email or Password incorrect");
        const OriginalPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASSWORD_SECRET
        ).toString(CryptoJS.enc.Utf8);
    
        OriginalPassword !== req.body.password &&
        res.status(401).json("Email or Password incorrect");
    
        if(req.params.userType === "admin" && user.userType !== "admin") { 
            res.status(402).json("Only the admins can login to dashboard");
        }

        if(req.params.userType === "delivery guy" && user.userType !== "delivery guy") { 
            res.status(402).json("Only delivery guys can login to dashboard");
        }

        if(req.params.userType === "user" && user.userType === "admin") { 
            res.status(402).json("This dashboard is not for admins");
        }

        if(req.params.userType === "user" && user.userType === "delivery guy") { 
            res.status(402).json("This dashboard is not for delivery guys");
        }
    
        const accessToken = jwt.sign(
        {
            id: user._id,
            userType: user.userType,
            isVerified: user.isVerified,
            isBlocked: user.isBlocked
        },
        process.env.JWT_SECRET,
        {expiresIn:"3d"}
        );
        const { password, ...others } = user._doc;
        res.status(200).json({...others, token: accessToken});
    } catch (err) {
        res.status(500).json(err);
    }
});

//forget password
router.post("/send-password", async (req, res) => {
	try {
		let user = await User.findOne({ email: req.body.email });
		!user && res.status(409).json("No user with given email!" );
        (user && user.userType !== "admin") && res.status(409).json("User with given email is not admin" );

        const password =  CryptoJS.AES.decrypt(
            user.password,
            process.env.PASSWORD_SECRET
        ).toString(CryptoJS.enc.Utf8);

		client.messages.create({
            body: `Your Merkato password is: ${password}`,
            from: '+17653911157',
            to: `+216${user.phoneNumber}` 
        })
        .then(response => {
            console.log(response.body)
            res.status(200).json(`Password sent to phone number: ${user.phoneNumber}`)
        })
        .catch(err => res.status(401).json(err.message));
	} catch (error) {
		res.status(500).json(error);
	}
});


module.exports = router;
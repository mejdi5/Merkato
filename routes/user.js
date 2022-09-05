const User = require("../models/User");
const router = require("express").Router();
const CryptoJS = require("crypto-js");
const { 
    nameValidation, 
    emailValidation, 
    passwordValidation, 
    validator,
    isAuthenticated, 
    isAdmin, 
    cinValidation
} = require("./middlewares");


//Get all users (for admin)
router.get("/", isAdmin, async (req, res) => { 
    try {
    const users = await User.find({userType: "user"}).sort({createdAt: -1});
    res.status(200).json(users);
    if(req.headers.token) {
        req.headers.token = undefined
    }
    } catch (err) {
    res.status(500).json(err);
    }
});

//Get all delivery guys (for admin)
router.get("/delivery-guys", isAdmin, async (req, res) => {
    try {
    const deliveryGuys = await User.find({userType: "delivery_guy"}).sort({createdAt: -1});
    res.status(200).json(deliveryGuys);
    if(req.headers.token) {
        req.headers.token = undefined
    }
    } catch (err) {
    res.status(500).json(err);
    }
});


//Add delivery guy (for admin)
router.post("/delivery-guy", nameValidation, cinValidation , emailValidation, passwordValidation , validator, isAdmin, async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        cin: req.body.cin,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        password: CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASSWORD_SECRET
        ).toString(),
        userType: "delivery_guy",
        isVerified: true
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

//Edit user (for the user itself)
router.put("/:userId", isAuthenticated, async (req, res) => {
    try {
        if(req.user.id === req.params.userId) {
        const updatedUser = await User.findByIdAndUpdate(
        req.params.userId,   
        {$set: req.body},
        { new: true }
        );
    res.status(200).json(updatedUser);
    } else {
        res.status(403).json("You are not allowed to do that!");
    } 
    }catch (err) {
    res.status(500).json(err);
    }
});

//block/Unblock delivery guy (for the user itself)
router.put("/deliveryGuy/:deliveryGuyId", isAdmin, async (req, res) => {
    console.log(req.body)
    try {
        const updatedUser = await User.findByIdAndUpdate(
        req.params.deliveryGuyId,   
        {$set: {
            isBlocked: req.body.isBlocked
        }},
        { new: true }
        );
    res.status(200).json(updatedUser);
    }catch (err) {
    res.status(500).json(err);
    }
});

//edit password (for the user itself)
router.put("/edit-password/:userId", isAuthenticated, async (req, res) => {
    try {
        if(req.user.id === req.params.userId) {
            const user = await User.findById(req.params.userId);
            const hashedPassword = CryptoJS.AES.decrypt( 
                user.password,
                process.env.PASSWORD_SECRET
            );
            const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
            if(OriginalPassword !== req.body.oldPassword) {
                res.status(401).json("Password incorrect");
            } else {
                req.body.newPassword = CryptoJS.AES.encrypt(
                    req.body.newPassword,
                    process.env.PASSWORD_SECRET
                    ).toString();                
            const updatedUser = await User.findByIdAndUpdate(
                req.params.userId,   
                {$set: {
                    password: req.body.newPassword
                }},
                { new: true }
            );  
            res.status(200).json(updatedUser);
            }
    } else {
        res.status(403).json("You are not allowed to do that!");
    } 
    }catch (err) {
    res.status(500).json(err);
    }
});


//Delete user (for the admin and the user itself)
router.delete("/:userId", isAuthenticated, async (req, res) => {
    try {
        if(req.user.id === req.params.userId || req.user.userType === "admin") {
            await User.findByIdAndDelete(req.params.userId);
            res.status(200).json("User has been deleted...");
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    } catch (err) {
        console.log(err)
    res.status(500).json(err);
    }
});


module.exports = router;



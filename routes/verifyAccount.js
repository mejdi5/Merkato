const router = require("express").Router();
const User = require("../models/User");
const { isAuthenticated } = require('./middlewares')
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)


//send code verification
router.get('/send-code/:phoneNumber', async (req, res) => { 
    try {
        await client
        .verify
        .services(process.env.SERVICE_ID)
        .verifications
        .create({
            to: `+216${req.params.phoneNumber}`,
            channel: 'sms' 
        })
        res.status(200).json( "Code verification is sent!!")
    } catch (error) {  
        res.status(500).json(error.message)
    }
})

//verify code
router.get('/verify-code/:phoneNumber/:code', isAuthenticated, async (req, res) => {
    try {
        const data = await twilioConfig
        .verify
        .services(process.env.SERVICE_ID)
        .verificationChecks
        .create({
            to: `+216${req.params.phoneNumber}`,
            code: req.params.code
        })
        if (data.status === "approved") {
            res.status(200).json("code verification accepted")
        } else {
            res.status(400).json("Wrong phone number or code")
        }
    } catch (error) {
        console.log(error)
    }
})

//set user as verified
router.put("/verified-user/:userId", async (req, res) => {
    try {
        await User.updateOne({_id: req.params.userId},
            {$set: {
                isVerified: true
            }},
            { new: true })
        res.status(200).json("User is Verified");
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

module.exports = router
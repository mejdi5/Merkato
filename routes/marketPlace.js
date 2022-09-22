const router = require("express").Router();
const MarketPlace = require("../models/MarketPlace");
const {isAuthenticated, isAdmin} = require("./middlewares");


//Post new market place (for user)
router.post("/", isAuthenticated, async (req, res) => {
    try {
        if(!req.user.isVerified) {
            res.status(402).json("You must verify your account first")
        }
        if(req.user.userType === "user") {                                                                                                                
            const newMarketPlace = new MarketPlace(req.body);
            const savedMarketPlace = await newMarketPlace.save();
            res.status(200).json(savedMarketPlace);
        } else {
            res.status(403).json("Admin and delivery guy cannot create a market place");
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

//Get all market places
router.get("/", async (req, res) => {
    try {
        const marketPlaces = await MarketPlace.find().sort({createdAt: -1});
        res.status(200).json(marketPlaces);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Delete a market place (for admin and user)
router.delete("/:marketId", isAuthenticated, async (req, res) => {
    try {
        const marketPlaceToDelete = await MarketPlace.findById(req.params.marketId)
        if((req.user.userType === "user" && req.user.id === marketPlaceToDelete.userId) || req.user.userType === "admin") {
            await MarketPlace.deleteOne({_id: req.params.marketId});
            res.status(200).json("Market place has been deleted...");
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

//Edit market place (for user)
router.put("/:marketId", isAuthenticated, async (req, res) => {
    try {
        const marketPlaceToEdit = await MarketPlace.findById(req.params.marketId)
        if(req.user.id === marketPlaceToEdit.userId || req.user.userType === "admin") {
            const updatedMarketPlace = await MarketPlace.findByIdAndUpdate(
                req.params.marketId,
                {$set: req.body},
                { new: true }
            );
            res.status(200).json(updatedMarketPlace);
        } else {
            res.status(403).json("You are not allowed to do that!");
        }
    } catch (err) {
    res.status(500).json(err);
    }
});

//set new payment date
router.put("/pay/:marketId", isAdmin, async (req, res) => {
    try {
        const updatedMarketPlace = await MarketPlace.findByIdAndUpdate(
            req.params.marketId,
            {$set: req.body},
            { new: true }
        );
    res.status(200).json(updatedMarketPlace);
    } catch (err) {
    res.status(500).json(err);
    }
});

module.exports = router;
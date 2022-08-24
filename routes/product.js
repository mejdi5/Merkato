const router = require("express").Router();
const MarketPlace = require("../models/MarketPlace");
const Product = require("../models/Product");
const {isAuthenticated} = require("./middlewares");


//Post new product (for manager user)
router.post("/", isAuthenticated, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const marketPlace = await MarketPlace.findById(newProduct.domainId);
        if(req.user.userType === "user" && req.user.id === marketPlace.userId) {                                                                                                                
            const savedProduct = await newProduct.save();
            res.status(200).json(savedProduct);
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get products of a marketplace 
router.get("/:domainId", async (req, res) => {
    try {
        const products = await Product.find({ domainId: req.params.domainId.toString() }).sort({createdAt: -1});
        res.status(200).json(products);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

//Edit Product (for the manager user)
router.put("/:productId", isAuthenticated, async (req, res) => {
    try {
        const productToUpdate = await Product.findById(req.params.productId)
        const marketPlace = await MarketPlace.findById(productToUpdate.domainId);
        if(req.user.userType === "user" && req.user.id === marketPlace.userId) {                                                                                                                
            await Product.updateOne(
                {_id: req.params.productId},
                {$set: req.body},
                { new: true }
                );
            const updatedProduct = await Product.findById(req.params.productId)
            res.status(200).json(updatedProduct);
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

//Delete product (for user manager and admin)
router.delete("/:productId", isAuthenticated,  async (req, res) => {
    try {
        const productToDelete = await Product.findById(req.params.productId)
        const marketPlace = await MarketPlace.findById(productToDelete.domainId);
        if((req.user.userType === "user" && req.user.id === marketPlace.userId) || req.user.userType === "admin") {
            await Product.findByIdAndDelete(req.params.productId);
            res.status(200).json("Product has been deleted...");
        } else {
            res.status(403).json("You are not allowed to do that..");
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

module.exports = router
const router = require("express").Router();
const Order = require("../models/Order");
const MarketPlace = require("../models/MarketPlace");
const {isAuthenticated, isAdmin,  isDeliveryGuy} = require("./middlewares");
const Product = require("../models/Product");
const Taxe = require("../models/Taxe");


//Create new Order
router.post("/", isAuthenticated, async (req, res) => {
    try {
        const taxe = await Taxe.findOne({governorate: req.body.address.governorate})
        const products = await Product.find()
        const totalProductsPrice = req.body.products.map(p => {
            const product = products.find(product => p?.productId === product._id.toString())
            return product.price*p?.quantity
            }).reduce((a,b) => a + b)
        const newOrder = new Order({
            userId: req.body.userId,
            domainId: req.body.domainId,
            products: req.body.products,
            address: req.body.address,
            status: req.body.status,
            total: totalProductsPrice,
            deliveryCost: taxe.deliveryCost,
            fees: taxe.fees,
            totalToPay: totalProductsPrice + taxe.deliveryCost + taxe.fees
        });
        const marketPlace = await MarketPlace.findById(newOrder.domainId);
        if(!req.user.isVerified) {
            res.status(402).json("You must verify your account first")
        } else if (marketPlace.isBlocked) {
            res.status(401).json("market place is blocked! You cannot post this order");
        } else if (req.user.id === marketPlace.userId) {
            res.status(401).json("You cannot post an order in your own market place");
        } else if (req.user.userType === "user" && req.user.id !== marketPlace.userId) {                                                                                                             
            const savedOrder = await newOrder.save();
            res.status(200).json({msg: "Order posted with success", savedOrder});
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    } catch (err) {
        console.log(err)
    res.status(500).json(err);
    }
});

//Get all orders (for admin)
router.get("/", isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({createdAt: -1});
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});


//Get orders of one user (for admin and the user itself)
router.get("/user-orders/:userId", isAuthenticated, async (req, res) => {
    try {
        if(req.user.userType === "admin" || req.user.id === req.params.userId) {                                                                                                                
            const orders = await Order.find({ userId: req.params.userId }).sort({createdAt: -1});
            res.status(200).json(orders);
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    } catch (err) {
        res.status(500).json(err);
    }
    });

//Get orders of one marketplace (for admin and manager)
router.get("/market-orders/:marketId", isAuthenticated, async (req, res) => {
    try {
        const marketPlace = await MarketPlace.findById(req.params.marketId);
        if(req.user.userType === "admin" || req.user.id === marketPlace.userId) {                                                                                                                
            const orders = await Order.find({ domainId: req.params.marketId }).sort({createdAt: -1});
            console.log(orders)
            res.status(200).json(orders);
        } else {
            res.status(403).json("You are not allowed to do that");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});    

//Edit Order (for the user)
router.put("/:orderId", isAuthenticated, async (req, res) => {
try {
    const orderToUpdate = await Order.findById(req.params.orderId)
    if(req.user.userType === "user" && req.user.id === orderToUpdate.userId) {                                                                                                                
        await Order.updateOne(
            {_id: req.params.orderId},
            {$set: {
                products: req.body.products,
                address: req.body.address
            }},
            { new: true }
            );
        const updatedOrder = await Order.findById(req.params.orderId)
        res.status(200).json(updatedOrder);
    } else {
        res.status(403).json("You are not allowed to do that");
    }
} catch (err) {
    console.log(err)
    res.status(500).json(err);
}
});

//set order as delivered 
router.put("/delivered/:orderId", isDeliveryGuy,  async (req, res) => {
    try {
        if(!req.user.isVerified) {
            res.status(402).json("You must verify your account first")
        } 
        if(req.user.isBlocked) {
            res.status(402).json("Action not allowed, You are blocked by the admin")
        } 
        const updatedOrder = await Order.findByIdAndUpdate(
        req.params.orderId,
        {$set: {
            status: "delivered",
            deliveredBy: req.user.id
        }},
        { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//set order as declined
router.put("/declined/:orderId", isDeliveryGuy,  async (req, res) => {
    try {
        if(!req.user.isVerified) {
            res.status(402).json("You must verify your account first")
        } 
        if(req.user.isBlocked) {
            res.status(402).json("Action not allowed, You are blocked by the admin")
        } 
        const updatedOrder = await Order.findByIdAndUpdate(
        req.params.orderId,
        {$set: {
            status: "declined"
        }},
        { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:orderId", isAdmin, async (req, res) => {
try {
    await Order.findByIdAndDelete(req.params.orderId);
    res.status(200).json("Order has been deleted...");
} catch (err) {
    console.log(err)
    res.status(500).json(err);
}
});



module.exports = router;
const router = require("express").Router();
const Taxe = require("../models/Taxe");
const {isAdmin} = require("./middlewares");

const governorates = [
    "Ariana", "Beja", "Ben Arous", "Bizerte", "Gabes", "Gafsa", "Jendouba", "Kairouen", "Kasserin", "Kebili", "Kef", "Mahdia", "Manouba",
    "Medenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"
]

//Post new taxe (for admin)
router.post("/", isAdmin, async (req, res) => {
    try {
    for (let i=0; i < governorates.length; i++) {
        const taxe = await Taxe.findOne({governorate: governorates[i]})
        if (!taxe) {
            const newTaxe = new Taxe({
                governorate: governorates[i]
            });
            await newTaxe.save();
        } 
    }
    } catch (err) {
        res.status(500).json(err);
    }
});

//Get taxes
router.get("/", async (req, res) => { 
    try {
        const taxes = await Taxe.find()
        res.status(200).json(taxes);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Edit taxe (for admin)
router.put("/:governorate", isAdmin, async (req, res) => {
    try {
        const updatedTaxe = await Taxe.findOneAndUpdate(
            {governorate: req.params.governorate},
            {$set: {
                deliveryCost: req.body.deliveryCost,
                fees: req.body.fees
            }},
            { new: true }
            )
            res.status(200).json(updatedTaxe);
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

module.exports = router


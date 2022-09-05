const { validate } = require('deep-email-validator');
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const nameValidation = (req, res, next) => {
    if (req.body.name.length === 0) {
        res.status(400).json({msg: 'Name is required'})
    } else {
        next()
    }
}

const cinValidation = (req, res, next) => {
    if (req.body.cin && (req.body.cin.toString().length !== 8 || typeof req.body.cin !== 'number')) {
        res.status(400).json({msg: 'Invalid cin..'})
    } else {
        next()
    }
}

const emailValidation = async (req, res, next) => {
    const emailValidator = await validate(req.body.email)
    const isValid = emailValidator.valid
    let user = await User.findOne({ email: req.body.email });  
    if (!isValid) {
        res.status(400).json({msg: 'Email is not valid'})
    } else if (user) {
        res.status(400).json({ msg: 'this email already exists' });
    } else {
        next()
    }
}

const passwordValidation =  (req, res, next) => {
    if (req.body.password.length < 6) {
        res.status(400).json({msg: "Password must have at least 6 characters"})
    } else {
        next()
    }
}

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array().map((err) => ({
            msg: err.msg,
            })),
    });
    }
    next();
};


const isAuthenticated = (req, res, next) => {
const token = req.headers.token;
if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) res.status(403).json("Token is not valid!");
        req.user = user;
        next();
    });
} else {
    return res.status(401).json("You are not authenticated!");
}
};


const isAdmin = (req, res, next) => {
isAuthenticated(req, res, () => {
    if (req.user.userType === "admin") {
        next();
    } else {
    res.status(403).json("You are not allowed to do that!");
    }
});
};

const isDeliveryGuy = (req, res, next) => {
isAuthenticated(req, res, () => {
    if (req.user.userType === "delivery_guy") {
        next();
    } else {
        res.status(403).json("You are not allowed to do that!");
    }
});
};

module.exports = {
    nameValidation,
    cinValidation,
    emailValidation,
    passwordValidation,
    validator,
    isAuthenticated,
    isAdmin,
    isDeliveryGuy
};
// @login & registration
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const gravatar = require("gravatar");
const keys = require("../../config/keys");
const passport = require("passport");

const User = require("../../models/User.js");

/*
 * $route GET /api/users/test
 * @desc return requested json data
 * @access public
 */
router.get("/test", (req,res) => {
    res.json({msg:"Login succeeded!"})
})

/*
 * $route POST /api/users/register
 * @desc return requested json data
 * @access public
 */
router.post("/register", (req, res) => {
    //console.log(req.body);

    // check if email already exists
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.status(400).json("Email already registered!" )
            } else {
                const avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    identity: req.body.identity
                })

                // encrypt newUser password
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
})

/*
 * $route POST /api/users/login
 * @desc return token jwt passport
 * @access public
 */
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json("User does not exist!" );
            }

            // compare password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // generate token using jsonwebtoken
                        const jwt_rules = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identity
                        };
                        jwt.sign(jwt_rules, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            if (err) throw err;
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        });
                        //res.json({ msg: "success!" });
                    } else {
                        return res.status(404).json("Wrong password!" );
                    }
                })
        })
})

/*
 * $route GET /api/users/current
 * @desc return current user info
 * @access private
 */
router.get("/current", passport.authenticate("jwt", {session:false}), (req, res) => {
    //res.json({ msg: "success!" });
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    });
})

module.exports = router;
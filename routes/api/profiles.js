// @login & registration
const express = require("express");
const router = express.Router();
const passport = require("passport");

const Profile = require("../../models/Profile.js");

/*
 * $route GET /api/profiles/test
 * @desc return requested json data
 * @access public
 */
router.get("/test", (req,res) => {
    res.json({msg:"Profile works!"})
})

/*
 * $route POST /api/profiles/add
 * @desc ������Ϣ�ӿ�
 * @access Private
 */
router.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
    const profileFields = {};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.description) profileFields.description = req.body.description;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expense) profileFields.expense = req.body.expense;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;

    new Profile(profileFields).save().then(profile => {
        res.json(profile);
    });
});

/*
 * $route GET /api/profiles
 * @desc ����������Ϣ
 * @access Private
 */
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.find()
        .then(profile => {
            if (!profile) {
                return res.status(404).json("Null Content!");
            }
            res.json(profile);
        }).catch((err) => res.status(404).json(err));
});

/*
 * $route GET /api/profiles/:id
 * @desc ���󵥸���Ϣ
 * @access Private
 */
router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({_id: req.params.id})
        .then(profile => {
            if (!profile) {
                return res.status(404).json("Null Content!");
            }
            res.json(profile);
        }).catch((err) => res.status(404).json(err));
});

/*
 * $route POST /api/profiles/edit
 * @desc �༭��Ϣ�ӿ�
 * @access Private
 */
router.post("/edit/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    const profileFields = {};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.description) profileFields.description = req.body.description;
    if (req.body.income) profileFields.income = req.body.income;
    if (req.body.expense) profileFields.expense = req.body.expense;
    if (req.body.cash) profileFields.cash = req.body.cash;
    if (req.body.remark) profileFields.remark = req.body.remark;

    Profile.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: profileFields },
        { new: true }
    ).then(profile => res.json(profile));

});

/*
 * $route POST /api/profiles/delete
 * @desc ɾ����Ϣ�ӿ�
 * @access Private
 */
router.delete("/delete/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Profile.findOneAndRemove({ _id: req.params.id }).then(profile => {
             //profile.save().then(profile => res.json(profile));
            res.json(profile);
        })
        .catch(err => res.status(404).json("Deletion Failed!"));
});

module.exports = router;
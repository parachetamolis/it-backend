const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { compare } = require('bcrypt');

const router = express.Router();

// get all
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch(err) {
        res.json({ message: err });
    }
})

// get by id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
        console.log(Boolean(user));
    } catch (err) {
        res.json({ message: err });
    }
});

// register
router.post('/register', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    if(!(req.body.username && req.body.password)) {
        return res.status(400).send({ error: "Data not formatted properly" });
    }

    if(!(await UserExists(req.body.username))) {
        try {
            user.password = await bcrypt.hash(user.password, 10);

            const postedUser = await user.save();
            res.json({ message: "Registration successful"});
        } catch(err) { 
            res.json({ message: err });
        }
    }
    else res.json({ message: "This username is already taken"})

});

//login
router.post('/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username});

    if(user) {
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if(validPassword) res.status(200).json({ message: "Successfully logged in"}); 
        else res.status(400).json({ error: "Invalid password"});
    }
    else res.status(401).json({ error: "User does not exist" });
})

// delete
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.deleteOne({ _id: req.params.id });
        res.json(deletedUser);
    } catch(err) {
        res.json({ message: err });
    }
    });

// patch username
router.patch('/:id', async (req, res) => {
   try {
       const patchedUser = await User.updateOne(
            { _id: req.params.id },
            { $set: {username: req.body.username}
        });
        res.json(patchedUser);
   } catch (err) {
       res.json({ message: err });
   }
});

// patch password
router.patch('/:id', async (req, res) => {
    try {
        const patchedUser = await User.updateOne(
             { _id: req.params.id },
             { $set: {password: req.body.password}
         });
         res.json(patchedUser);
    } catch (err) {
        res.json({ message: err });
    }
 });

async function UserExists(name) {

    const user = await User.findOne({ username: name });
    return Boolean(user);
 
 }

module.exports = router;
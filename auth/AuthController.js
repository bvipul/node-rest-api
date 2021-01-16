const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const User = require('../user/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

const verifyToken = require('../verifyToken');

router.post('/register', (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        organization: req.body.organization
    }, (err, user) => {
        if (err) {
            return res.status(500).send("There was a problem registering the user.");
        }
    
        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400
        });

        res.status(200).send({ auth: true, token: token });
    })
});

router.get('/me', verifyToken, (req, res) => {
    User.findById(req.userId, { password: 0 }).populate('organization').exec((err, user) => {
        if (err) {
            return res.status(500).send("There was a problem finding the user" + err);
        }

        if (!user) {
            return res.status(404).send("User not found");
        }
        
        res.status(200).send(user);
    });
});

router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(500).send('Error on the server');
        }

        if (!user) {
            return res.status(404).send('No User found');
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null});
        }

        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400
        });

        res.status(200).send({ auth: true, token: token });
    });
});

module.exports = router;
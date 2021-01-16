const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const User = require('./User');

const verifyToken = require('../verifyToken');

// Regex function for search functionality
const escapeRegex = (string) => {
    return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// Create User
router.post('/', (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        organization: req.body.organization
    }, (err, user) => {
        if (err) {
            return res.status(500).send('There was an error adding information to the database');
        }

        res.status(200).send(user);
    });
});

// Get All Users
router.get('/', verifyToken, async (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 1; 
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    let sortBy = req.query.sortBy ? req.query.sortBy : 'createdAt';
    let orderBy = req.query.orderBy ? (req.query.orderBy == 'asc' ? 1 : -1) : -1;
    let searchCol = req.query.searchCol ? req.query.searchCol : '';
    let searchStr = req.query.searchStr ? req.query.searchStr : '';

    let query = {};

    if (searchCol && searchStr && !searchCol.startsWith('organization')) {
        query[searchCol] = new RegExp(escapeRegex(searchStr), 'gi');
    }

    let users = await User.find(query, { password: 0 })
        .populate('organization')
        .skip((limit * page) - limit)
        .limit(limit)
        .sort({ [sortBy] : orderBy })
        .exec();

    let numOfUsers = await User.count(query);
    
    if (searchCol && searchStr && searchCol == 'organization') {
        const regExp = new RegExp(escapeRegex(searchStr), 'gi')
        let searchUsers = await User.find({}).populate('organization');
        searchUsers = searchUsers.filter(user => regExp.test(user.organization.name));
        users = users.filter(user => regExp.test(user.organization.name));

        numOfUsers = searchUsers.length;
    }

    let data = {
        users: users,
        currentPage: page,
        pages: parseInt(numOfUsers / limit) + (numOfUsers % limit == 0 ? 0 : 1),
        numOfResults: numOfUsers
    };

    res.status(200).send(data);
});

// Get Using ID
router.get('/:id', verifyToken, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) {
            return res.status(500).send('There was a problem finding user');
        }
        if (!user) {
            return res.status(500).send('No user found');
        }
        res.status(200).send(user);
    });
});

// Delete User
router.delete('/:id', verifyToken, (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) {
            return res.status(500).send('There was a problem deleting the user');
        }
        res.status(200).send("User " + user.name + " was deleted");
    });
});

// Update User
router.put('/:id', verifyToken, (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
        if (err) {
            return res.status(500).send('There was a problem updating the user');
        }

        res.status(200).send(user);
    });
});

module.exports = router;
const express = require('express');
const app = express();
const db = require('./db');
const UserController = require('./user/UserController');
const AuthController = require('./auth/AuthController');
const Organization = require('./organization/Organization');

app.use('/api/auth', AuthController);
app.use('/users', UserController);

module.exports = app;
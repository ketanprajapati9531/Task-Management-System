const express = require('express');
const router = express.Router();
const { renderRegisterForm, register, loginUser, logoutUser, renderHomePage ,  exportToExcel} = require('./index.controller');

// Render register form
router.get('/register', renderRegisterForm);

// Handle user registration
router.post('/register', register);

// Handle user login
router.post('/login', loginUser);

// Handle user logout
router.get('/logout', logoutUser);

// Render home page+-
router.get('/home', renderHomePage);

// Export user data to Excel
router.get('/export', exportToExcel);

module.exports = router;

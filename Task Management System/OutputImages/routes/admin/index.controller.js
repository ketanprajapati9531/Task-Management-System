const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
console.log("admin controllers file run.....")


exports.login = async (req, res) => { // Define a function to handle user login
  console.log(req.body);
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ where: { email: email, is_admin: true } });

    if (admin) { // If the admin is found, check their password
      const isPasswordMatched = await bcrypt.compare(password, admin.password);

      if (isPasswordMatched) {
        console.log("admin logged in ", req.body);
        req.session.isLoggedIn = true;
        req.session.adminId = admin.id;
        return res.redirect('/admin/adminDashboard');
        
      }
    }
    console.log("invalid email and password");
    req.flash('error', 'Invalid email or password');
    return res.redirect('/admin');

  } catch (err) {
    console.error(err);
    console.log("admin log in error ")
    const errorMessage = "An error occurred while logging in";
    req.flash('error', 'An error occurred while logging in');
    return res.redirect('/admin');

  }
};


/*
exports.login = async (req, res) => {
  try {
    console.log("admin login try part");
    const { email, password } = req.body;

    const admin = await User.findOne({ where: { email: email, is_admin: true } });

    if (admin) {
      const isPasswordMatched = await bcrypt.compare(password, admin.password);
      console.log("admin if part controller");
      if (isPasswordMatched) {
        const token = jwt.sign(
          {
            userId: admin.id,
            isAdmin: true
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '1h'
          }
        );
        console.log("token : ", token)

        res.redirect('/admin/adminDashboard'); // Redirect to the dashboard route
        return;
      }
    }

    return res.status(401).json({
      message: 'Authentication failed!'
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'An error occurred while logging in'
    });
  }
};
*/

exports.getLogin = (req, res) => {
  console.log("getLogin");
  res.render('adminLogin', { messages: req.flash() });
};


/*
exports.adminDashboard = async (req, res) => { 
  try {
  console.log("enter in admin dashboard try");

    if (req.session.isLoggedIn && req.session.adminId) {
      console.log("enter in admin dashboard try part if condition");
      const users = await User.findAll(); // Get all the users from the database
      res.render('adminDashboard', {  //// Render the admin dashboard with the users data
        pageTitle: 'Admin Dashboard',
        path: '/admin/dashboard',
        users: users
      });
    } else {
      // If the user is not logged in or is not an admin, redirect to the login page
      console.log("admin dashboard else part")

      return res.redirect('/admin/login'); 
    }
  } catch (err) {
    console.error(err);
    //If an error occurs, return an error message
    return res.status(500).send("An error occurred while retrieving the dashboard data");
  }
};
*/
exports.adminDashboard = async (req, res) => {
  try {

    console.log("enter in admin dashboard try");
    console.log("REQ.USER : ", req.user)

    //if (req.user && req.user.is_admin) {
    if (req.session.isLoggedIn && req.session.adminId) {
      console.log("enter in admin dashboard try part if condition");

      const users = await User.findAll(); // Get all the users from the database
      res.render('adminDashboard', {  //// Render the admin dashboard with the users data
        pageTitle: 'Admin Dashboard',
        path: '/admin/adminDashboard',
        users: users
      });
    } else {
      console.log("admin dashboard else part")
      res.write("<h1>unauthorized access</h1>");
      res.end();
      //return res.redirect('/admin/login');
    }
  } catch (err) {
    console.error(err);

    return res.status(500).send("An error occurred while retrieving the dashboard data");
  }
};
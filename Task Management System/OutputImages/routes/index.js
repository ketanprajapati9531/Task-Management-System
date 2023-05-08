
const express = require('express');
const router = express.Router();
const adminIndex = require('./admin/index');
const todoIndex = require('./todo/index');
const authIndex = require('./auth/index');
//const auth = require('../middlewares/auth');
const flash = require('express-flash');
const { authenticateJWT } = require('../middlewares/userAuth');
const todoRoutes = require('./todos');

router.get('/', (req, res) => {
  res.send('Welcome to the API');
});
/*
router.get('/home', authenticateJWT, (req, res) => {
  res.render("home.ejs");
});
*/
// router.get('/home', (req, res) => {
//   res.render("home.ejs");
// });



router.use("/admin", adminIndex);
router.use("/todo", todoIndex);
router.use("/auth", authIndex);
// Todo routes
router.use('/api/todos', todoRoutes);
router.use('/api/todos', todoRoutes);
router.use(flash());
router.get('/register', (req, res) => {
  res.render("register.ejs")
});

router.get('/login', (req, res) => {
  res.render('login.ejs');
});



module.exports = router;



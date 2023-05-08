const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');
const cookieParser = require('cookie-parser');
const db = require('./config/database');
const session = require('express-session');
const passport = require('passport')
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const indexRoutes = require('./routes/index');
const todoRoutes = require('./routes/todos');

// "http://localhost:3000/api/todos/update-status" in postman GET request

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(flash());

app.use(
  session({
    secret: 'secret', //secret string used to sign the session ID cookie
    resave: false,
    saveUninitialized: false, //resave and saveUninitialized options are set to false to optimize performance
    store: new SequelizeStore({
      db: db
    })
  })//The store option is set to use the Sequelize store we imported earlier.
);

app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found 404 error');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      message: error.message
    }
  });
});

const PORT = process.env.PORT || 3000;

db.sync()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });










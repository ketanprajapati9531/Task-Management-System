const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Todo = require("../../models/todo");
const fs = require('fs');
const path = require('path');
const exceljs = require('exceljs');


console.log("user controllers file run.....")

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // User not found
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    if (user.is_admin) {
      req.flash('error', 'Admin login not allowed');
      return res.redirect('/login');
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      // Passwords don't match
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: false
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    // Set the Authorization header before redirecting to the home page
    req.headers.authorization = `Bearer ${token}`;
    console.log("token : ", token)

    req.session.userId = user.id; // Save user ID in session
    req.session.isLoggedIn = false;
    delete req.session.adminId;

    const todos = await Todo.findAll({ where: { user_id: user.id } }); // Fetch all todos assigned to the user
    console.log(todos); // For debugging purposes

    res.redirect('/auth/home');
   

  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong');
    res.redirect('/login');
  }
};

const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }

    res.clearCookie('sid');
    //Otherwise, it returns a success message as a JSON object.
    res.json({ message: 'Logged out successfully' });
  });
};

const renderRegisterForm = async (req, res) => {
  res.render('register', { messages: req.flash() });
};

const register = async (req, res) => {
  //extracts the name, email, and password from the request body
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    // Check if user with same email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      req.flash('error', 'Email already exists');
      return res.redirect('/register');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ name, email, password: hashedPassword });

    req.flash('success', 'Registered successfully');
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Something went wrong');
    res.redirect('/register');
  }
};


const renderHomePage = async (req, res) => {
  console.log("renderHome page run")
  try {
   // console.log("render home page try page req.session.userId ,", req.session.userId);
    const userTodos = await Todo.findAll({ where: { user_id: req.session.userId } });
   // const todos = userTodos.map(todo => todo.toJSON()); // Convert the todo objects to plain JSON objects
 //  console.log("userTodos : ", userTodos) 
   res.render('home', { todos: userTodos });

  } catch (error) {
    console.log("catch part render home")
    console.error(error);
    req.flash('error', 'Something went wrong');
    res.redirect('/login');
  }
};


// This function exports user data to an Excel file
const exportToExcel = async (req, res) => {
  console.log("exportToExcel ....");
  try {
    // Retrieve user data from the database
    const users = await User.findAll({ attributes: ['name', 'email'] });
    console.log("exportToExcel try part....");

    // Create a new Excel workbook and add a worksheet named 'Users'
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // Define column headers for the worksheet
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 50 },

    ];

    // Add user data to the worksheet
    users.forEach((user) => {
      console.log("exportToExcel for each part....");
      worksheet.addRow({
        name: user.name,
        email: user.email,
      });
    });
    
    // Save the Excel file to the file system
    const filePath = path.join(__dirname, '..', '..', 'public', 'users.xlsx');
    await workbook.xlsx.writeFile(filePath);

    // Send a JSON response indicating the export was successfull
    res.json({ message: 'Excel file created successfully' });
  } catch (error) {
    console.log("exportToExcel error part....");
    console.error(error);
    //Handle errors and send a 500 status code with a JSON response
    res.status(500).json({ error: 'Something went wrong' });
  }
};


module.exports = {
  renderRegisterForm,
  register,
  loginUser,
  logoutUser,
  renderHomePage,
  exportToExcel
};


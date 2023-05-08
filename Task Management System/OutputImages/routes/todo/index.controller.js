const Todo = require('../../models/todo');
const exceljs = require('exceljs');
const path = require('path');
const User = require('../../models/user');
console.log("todo controllers file run.....")




const addedTodo = (req, res) => {
           console.log(req.body ,"this is added todo");
    const { title, description , due_date , user_id } = req.body;
   
   
   Todo.create({ title, description , due_date , user_id })
   
      .then((todo) => {
         res.status(201).json(todo);
       })
   
       .catch((err) => {
         console.error(err);
         res.status(500).json({ error: 'error in add todo' });
       });
   };


   
   const exportTodosToExcel = async (req, res) => {
     console.log('exportTodosToExcel ....');
     try {
       // Retrieve todos data from the database
       const todos = await Todo.findAll({ 
       attributes: ['title', 'description','status','timetaken','onholded_time'],
       include: [{ model: User, attributes: ['name', 'email'] }] 
       });
       console.log('exportTodosToExcel try part....');
   
       // Create a new Excel workbook and add a worksheet named 'Todos'
       const workbook = new exceljs.Workbook();
       const worksheet = workbook.addWorksheet('Todos');
   
       // Define column headers for the worksheet
       worksheet.columns = [
         { header: 'Title', key: 'title', width: 30 },
         { header: 'Description', key: 'description', width: 50 },
         { header: 'status', key: 'status', width: 10 },
         { header: 'timetaken', key: 'timetaken', width: 20 },
         { header: 'onholded_time', key: 'onholded_time', width: 20 },
         { header: 'User Name', key: 'name', width: 30 }, // add user name column
      { header: 'User Email', key: 'email', width: 40 } // add user email column
      
       ];
   
       // Add todos data to the worksheet
       todos.forEach((todo) => {
         console.log('exportTodosToExcel for each part....');
         worksheet.addRow({
           title: todo.title,
           description: todo.description,
           status:todo.status,
           timetaken:todo.timetaken,
           onholded_time:todo.onholded_time ,
           name: todo.User.name, // add user name
        email: todo.User.email // add user email
          
         });
       });
   
       // Save the Excel file to the file system
       const filePath = path.join(__dirname, '..', '..', 'public', 'todos.xlsx');
       await workbook.xlsx.writeFile(filePath);
   
       // Send a JSON response indicating the export was successful
       res.json({ message: 'Excel file created successfully' });
     } catch (error) {
       console.log('exportTodosToExcel error part....');
       console.error(error);
       // Handle errors and send a 500 status code with a JSON response
       res.status(500).json({ error: 'Something went wrong' });
     }
   };
   
   module.exports = {
     exportTodosToExcel,
     addedTodo
   };
   
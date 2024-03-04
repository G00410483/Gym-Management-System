const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Define a configuration object for connecting to a database
const dbConfig = {
  host: 'localhost',     // Host name or IP address of the database server
  user: 'root',          // Username for authentication
  password: 'root',      // Password for authentication
  database: 'gymDB'      // Name of the database to connect to
};


// POST LOGIN METHOD
// Endpoint for handling login requests
app.post('/login', async (req, res) => {
  // Extract email and password from request body
  const { email, password } = req.body;
  // Log received email and password for debugging purposes
  console.log("Received Email:", email, "Password:", password);

  try {
    // Establish a connection to the database using the provided configuration
    const connection = await mysql.createConnection(dbConfig);
    // SQL query to retrieve user information based on the provided email
    const query = 'SELECT * FROM admins WHERE emailAddress = ?';
    // Execute the query, passing the email parameter
    const [rows] = await connection.execute(query, [email.trim()]); // Trim to remove potential spaces

    // Check if any user with the provided email exists
    if (rows.length > 0) {
      // Extract user data from the first row of the result set
      const user = rows[0];
      // Log the password retrieved from the database for comparison
      console.log("Database Password for comparison:", user.password); // Adjusted to 'password'

      // Compare the provided password with the hashed password stored in the database
      const match = await bcrypt.compare(password, user.password.trim()); // Adjusted to 'password' and ensured it's trimmed
      // If passwords match, generate a JWT token for authentication
      if (match) {
        // Create a JWT token containing the user's ID with a 24-hour expiration
        const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '24h' }); // Adjusted to 'id'
        // Send the token as a JSON response
        res.json({ token });
      } else {
        // If passwords don't match, send a 401 Unauthorized status
        console.log("Password comparison failed");
        res.status(401).send('Unauthorized');
      }
    } else {
      // If no user with the provided email is found, send a 401 Unauthorized status
      console.log("No user found with the provided email");
      res.status(401).send('Unauthorized');
    }
    // Close the database connection
    await connection.end();

  } catch (error) {
    // Handle any errors that occur during database connection or operation
    console.error('Database connection or operation failed:', error);
    // Send a 500 Internal Server Error status in case of an error
    res.status(500).send('Internal Server Error');
  }
});

// POST REGISTRATION METHOD
// Endpoint for handling user registration
// POST REGISTRATION METHOD
app.post('/register', async (req, res) => {
  // Request body to extract firstName, secondName, email and password
  const { firstName, secondName, email, password } = req.body;

  // Checks if required fields are missing, if so sends 400 status code
  if (!firstName || !secondName || !email || !password) {
    return res.status(400).send('Missing required registration information');
  }
  // Handling errors
  try {
    // Establish connection to db
    const connection = await mysql.createConnection(dbConfig);

    // Check if user already exists- trimms the email address to remove the white space
    const [users] = await connection.execute('SELECT * FROM admins WHERE emailAddress = ?', [email.trim()]);
    // Checks if user was found, if so, it closes db connection 
    if (users.length > 0) {
      await connection.end();
      return res.status(409).send('User already exists');
    }

    // Hash password with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert new user
    await connection.execute('INSERT INTO admins (firstName, secondName, emailAddress, password) VALUES (?, ?, ?, ?)', 
    [firstName, secondName, email.trim(), hashedPassword]);
    // Close connection
    await connection.end();

    // Create JWT token
    const token = jwt.sign({ email: email.trim() }, 'your_secret_key', { expiresIn: '24h' });
    // Sends JSON response with a success message
    res.json({ message: 'Registration successful', token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET MEMBERS METHOD
// Endpoint for fetching all members
app.get('/members', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [members] = await connection.execute('SELECT * FROM members');
    await connection.end();
    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).send('Internal Server Error');
  }
});


// GET CLASSES METHOD
// To fetch all class records
app.get('/classes', async (req, res) => {
  try {
    // Establish connection to db
    const connection = await mysql.createConnection(dbConfig);
    // Execute a SQL query to select all records from the 'classes' table, ordering them by time and day.
    const [classes] = await connection.execute('SELECT * FROM classes ORDER BY time, day');
    // Close connection to db
    await connection.end();
    // Respond with the fetched classes in JSON format.
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST CLASSES METHOD
// To add new class recrod
app.post('/classes', async (req, res) => {
  // Extract class details from the request body
  const { name, instructor_name, time, day, max_capacity } = req.body;

  // Check if all required fields are provided
  if (!name || !instructor_name || !time || !day || !max_capacity) {
    return res.status(400).send('Missing required class information');
  }

  try {
    // Establish connection to db
    const connection = await mysql.createConnection(dbConfig);

    // SQL query to insert a new class
    const query = 'INSERT INTO classes (name, instructor_name, time, day, max_capacity) VALUES (?, ?, ?, ?, ?)';
    
    // Execute the query with the class data
    await connection.execute(query, [name, instructor_name, time, day, parseInt(max_capacity)]);
    // End the connection
    await connection.end();
    // Respond with 201 status and success message
    res.status(201).json({ message: 'Class added successfully' });
  } catch (error) {
    console.error('Failed to add class:', error);
    res.status(500).send('Internal Server Error');
  }
});

// PUT CLASSES METHOD
// To update an existing class record
app.put('/classes/:id', async (req, res) => {
  // Extract the class ID from the request URL parameters
  const { id } = req.params;
  // Extraxt the updated class details from the request body
  const { name, instructor_name, time, day, max_capacity } = req.body;

  // Validate that all required class details are provided
  if (!name || !instructor_name || !time || !day || !max_capacity) {
    return res.status(400).send('Missing required class information');
  }
  // Handle the errors
  try {
    // Establish connection
    const connection = await mysql.createConnection(dbConfig);
    // SQL query for updating the specified class record
    const query = `
      UPDATE classes 
      SET name = ?, instructor_name = ?, time = ?, day = ?, max_capacity = ?
      WHERE id = ?`;
      // Execute the query
    await connection.execute(query, [name, instructor_name, time, day, max_capacity, id]);
    // End the connection
    await connection.end();

    res.json({ message: 'Class updated successfully' });
  } catch (error) {
    console.error('Failed to update class:', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE CLASS METHOD
// To delete a specific class record
app.delete('/classes/:id', async (req, res) => {
  // Extract the class ID from the request URL parameters
  const { id } = req.params;

  // Handle the errors
  try {
    // Establish connection to db
    const connection = await mysql.createConnection(dbConfig);
    // SQL query to delete specific class record 
    const query = 'DELETE FROM classes WHERE id = ?';
    // Execute query
    await connection.execute(query, [id]);
    // End the connection
    await connection.end();

    //
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Failed to delete class:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

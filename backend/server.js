
const express = require('express');
const cors = require('cors');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const stripe = require("stripe")('sk_test_51OyyOfRpGdubHKaAe5oG4WuHX4MxKxVBTcfADBei7Tu5hkhDKmocCKVsK8DRKxt7q3UeEFDCUCPaHqbY22Xv90cc00sRySxfuT');

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


// POST request to /create-payment-intent
// Reference: https://docs.stripe.com/api/payment_intents/create
app.post('/create-payment-intent', async (req, res) => {
  // Retrive payment details
  const { amount, email } = req.body;

  // Create Stripe payment intent with provided details
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      receipt_email: email,
      amount: amount * 100,
      currency: 'eur',
    });
    // Establish connection to the database
    const connection = await mysql.createConnection(dbConfig);

    // Current date in 'YYYY-MM-DD' format
    const paymentDate = new Date().toISOString().slice(0, 10); // Format to YYYY-MM-DD

    // Query to insert the payment details into payments table
    await connection.execute(
      'INSERT INTO payments (email_address, amount, payment_date) VALUES (?, ?, ?)',
      [email, amount, paymentDate]
    );

    // Update last_payment_date in members table
    await connection.execute(
      'UPDATE members SET last_payment_date = ? WHERE email_address = ?',
      [paymentDate, email]
    );

    // Respond to the client with a 200 OK status and send the client_secret of the payment intent in JSON format
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    // Respond to the client with a 500 Internal Server Error status and send the error message in JSON format
    res.status(500).json({ error: error.message });
  }
});



//GET HOMEPAGE METHOD
app.get('/', async (req, res) => {
  try {
    // Establish connection to the database
    const connection = await mysql.createConnection(dbConfig);

    // Query to select all types of membership
    let query = 'SELECT DISTINCT * FROM membership';

    // Execute the SQL query
    const [plans] = await connection.execute(query);

    // Close the connection to database
    await connection.end();

    // Respond with JSON containing the fetched member details
    res.json(plans);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).send('Internal Server Error');
  }
});

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
    let query = 'SELECT * FROM admins WHERE email_address = ?';
    // Execute the query, passing the email parameter
    let [rows] = await connection.execute(query, [email.trim()]); // Trim to remove potential spaces

    let role = 'admin'; // Assume user is an admin initially

    if (rows.length === 0) {
      // If not found in admins, check the members table
      query = 'SELECT *, last_payment_date FROM members WHERE email_address = ?';
      [rows] = await connection.execute(query, [email.trim()]);

      role = 'member'; // User must be a member if found in this table
    }

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
        const token = jwt.sign({ email: user.email_address, role: role }, 'your_secret_key', { expiresIn: '24h' });

        // If the user's role is member
        if (role === 'member') {
          // Reference: https://stackoverflow.com/questions/7937233/how-do-i-calculate-the-date-in-javascript-three-months-prior-to-today
          // Create a Date object from the user's last payment date
          const lastPaymentDate = new Date(user.last_payment_date);
          // Create a new Date object for the current date and time
          const currentDate = new Date();
          // Subtract one month from the current date to find the date one month ago
          const oneMonthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));

          // Execute the query
          const [typeOfMembershipRows] = await connection.execute('SELECT type_of_membership FROM members WHERE email_address = ?', [email]);

          // Ensure there is at least one row and access the type_of_membership field
          if (typeOfMembershipRows.length > 0 && lastPaymentDate < oneMonthAgo || user.last_payment_date == null) {
            const typeOfMembership = typeOfMembershipRows[0].type_of_membership;
            console.log(typeOfMembership);

            // Fetch membership price for this user
            query = 'SELECT price FROM membership WHERE type_of_membership = ?';
            const [priceRows] = await connection.execute(query, [typeOfMembership]);
            const price = priceRows.length > 0 ? priceRows[0].price : null;
            console.log(price);

            // User's last payment was more than a month ago, redirect to the payment page
            return res.json({ token, role, email, redirect: 'payment', price });
          }
        }
        // Either not a member or payment up-to-date; redirect to homepage
        res.json({ token, role, email, redirect: '' });
      }
      else {
        // If passwords don't match, send a 401 Unauthorized status
        console.log("Password comparison failed");
        res.status(401).send('Unauthorized');
      }
    }
    else {
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
    // Compare the provided password with the hashed password stored in the database
    // Reference: https://stackoverflow.com/questions/77850971/bcrypt-compare-password
    const match = await bcrypt.compare(password, user.password.trim()); // Adjusted to 'password' and ensured it's trimmed
    // If passwords match, generate a JWT token for authentication
    if (match) {
      // Create a JWT token containing the user's ID with a 24-hour expiration
      // Reference: https://stackoverflow.com/questions/56753929/how-to-get-user-id-using-jwt-token
      const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '24h' });
      // Send the token as a JSON response
      res.json({ token });
    } else {
      // If passwords don't match, send a 401 Unauthorized status
      console.log("Password comparison failed");
      res.status(401).send('Unauthorized');
    }

    // Hash password with a salt round of 10
    // Reference: https://snyk.io/advisor/npm-package/bcrypt/functions/bcrypt.hash
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

// Endpoint for handling user registration
// POST REGISTER NEW MEMBER METHOD
app.post('/registerMember', async (req, res) => {

  // Request body to extract firstName, secondName, email and password
  const { ppsNumber, firstName, secondName, email, password, gender, dateOfBirth, startDate, typeOfMembership } = req.body;

  // Checks if required fields are missing, if so sends 400 status code
  if (!ppsNumber || !firstName || !secondName || !email || !password || !gender || !dateOfBirth || !startDate || !typeOfMembership) {
    return res.status(400).send('Missing required registration information');
  }
  // Handling errors
  try {
    // Establish connection to db
    const connection = await mysql.createConnection(dbConfig);

    // Check if member already exists
    const [membersEmail] = await connection.execute('SELECT * FROM members WHERE email_address = ?', [email.trim()]);
    const [membersPPS] = await connection.execute('SELECT * FROM members WHERE pps_number = ?', [ppsNumber.trim()]);
    // Checks if user's email address was found, if so, it closes db connection 
    if (membersEmail.length > 0) {
      await connection.end();
      res.json({ message: 'Email address already exists' });
    }
    // Checks if user's PPS number was found, if so, it closes db connection 
    if (membersPPS.length > 0) {
      await connection.end();
      res.json({ message: 'PPS number address already exists' });
    }

    // Hash password with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // Execute query
    await connection.execute(
      'INSERT INTO members (pps_number, first_name, second_name, email_address, password, gender, date_of_birth, start_date, type_of_membership) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [ppsNumber, firstName, secondName, email, hashedPassword, gender, dateOfBirth, startDate, typeOfMembership]

    );
    console.log("New member saved.");

    // Fetch membership price for this user
    query = 'SELECT price FROM membership WHERE type_of_membership = ?';

    const [priceRows] = await connection.execute(query, [typeOfMembership]);
    // Check if the 'priceRows' array contains any results. If it does, access the 'price' property of the first object in the array to get the price of the membership.
    const price = priceRows.length > 0 ? priceRows[0].price : null;
    console.log(price);

    // Close connection
    await connection.end();

    // Sends JSON response with a success message
    res.status(200).json("Registered");
    res.json({ message: 'Registration successful', redirect: 'payment', price, email });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET MEMBERS METHOD
// Endpoint for fetching members with optional search functionality
app.get('/members', async (req, res) => {
  try {
    // Destructures the `searchTerm` and `sort` variables from the query
    const { searchTerm, sort } = req.query; // Capture sort parameter from query
    // Converts the `searchTerm` to lowercase and trims whitespace, or sets it to null if it's not provided.
    const searchTermLower = searchTerm ? searchTerm.toLowerCase().trim() : null;

    // Establish database connection
    const connection = await mysql.createConnection(dbConfig);

    // Quert to select all from members
    let query = 'SELECT * FROM members';

    // Appends query to apply the filter
    if (searchTermLower) {
      query += ' WHERE LOWER(first_name) LIKE ? OR LOWER(second_name) LIKE ? OR LOWER(email_address) LIKE ?';
    }

    // If sort parameter provided, orders result by specified column
    if (sort) {
      query += ` ORDER BY ${sort}`;
    }

    // If a search term is provided, creates an array with the term to replace the placeholders (?).
    // Reference
    const params = searchTermLower ? [`%${searchTermLower}%`, `%${searchTermLower}%`, `%${searchTermLower}%`] : [];

    // Executes the SQL query with the specified parameters (if any), and destructures the first element of the result to get the members.
    const [members] = await connection.execute(query, params);

    await connection.end();

    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).send('Internal Server Error');
  }
});


// UPDATE MEMBER METHOD
// Endpoint for updating an existing member
app.put('/members/:id', async (req, res) => {
  const { id } = req.params;
  const { pps_number, first_name, second_name, email_address, gender, date_of_birth, start_date, type_of_membership } = req.body;

  // Checks if any of the required member details are missing in the request body.
  if (!pps_number || !first_name || !second_name || !email_address || !gender || !date_of_birth || !start_date || !type_of_membership) {
    return res.status(400).send('Missing required member information');
  }

  try {
    // Establish connection to database
    const connection = await mysql.createConnection(dbConfig);
    // SQL query to update a member's details in the database for the specified 'id'
    const query = `
      UPDATE members 
      SET first_name = ?, second_name = ?, email_address = ?, gender = ?, type_of_membership = ?
      WHERE id = ?`;

    // Executes the SQL query with the provided member details and the member 'id'.
    await connection.execute(query, [first_name, second_name, email_address, gender, type_of_membership, id]);
    await connection.end();

    // Responds with a JSON object containing a success message upon successful update
    res.json({ message: 'Member updated successfully' });
  } catch (error) {
    console.error('Failed to update member:', error);
    res.status(500).send('Internal Server Error');
  }
});


// DELETE MEMBER METHOD
// Endpoint for deleting a specific member
app.delete('/members/:id', async (req, res) => {
  const { id } = req.params;
  console.log(req.params);

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Retrieve the email address of the member
    const getEmailQuery = 'SELECT email_address FROM members WHERE id = ?';
    const [members] = await connection.execute(getEmailQuery, [id]);
    const email = members[0].email_address;
    console.log(email);

    // Delete all notifications for that email address
    const deleteNotificationsQuery = 'DELETE FROM notifications WHERE email_address = ?';
    await connection.execute(deleteNotificationsQuery, [email]);

    // Delete all bookings for that email address
    const deleteBookingsQuery = 'DELETE FROM bookings WHERE email_address = ?';
    await connection.execute(deleteBookingsQuery, [email]);

    // Delete all payments for that email address
    const deletePaymentsQuery = 'DELETE FROM payments WHERE email_address = ?';
    await connection.execute(deletePaymentsQuery, [email]);

    // Finally, delete the member
    const deleteMemberQuery = 'DELETE FROM members WHERE id = ?';
    await connection.execute(deleteMemberQuery, [id]);

    // Close the database connection
    await connection.end();

    // Respond with success message
    res.json({ message: 'Member and all related data deleted successfully' });
    // Return success response
    res.status(200).json({ message: 'Member and all related data deleted successfully' });
  } catch (error) {
    console.error('Failed to delete member and related data:', error);

    res.status(500).send(`Internal Server Error: ${error.message}`);
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

// POST class method to add a new class record
app.post('/classes', async (req, res) => {
  const { class_name, instructor_name, time, day, max_capacity, image } = req.body;

  // Check if required fields are provided
  if (!class_name || !instructor_name || !time || !day || !max_capacity || !image) {
    return res.status(400).send('Missing required class information');
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    // SQL query to insert a new class record with the image URL
    const query = `INSERT INTO classes (class_name, instructor_name, time, day, max_capacity, image) VALUES (?, ?, ?, ?, ?, ?)`;

    // Execute the query with the new class data
    await connection.execute(query, [class_name, instructor_name, time, day, max_capacity, image]);

    const [emails] = await connection.execute('SELECT email_address FROM bookings WHERE class_name = ?', [class_name]);
    await connection.end();
    res.status(200).json({ message: 'Class added successfully' });
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
  const { class_name, instructor_name, time, day, max_capacity } = req.body;
  const type = 'update';

  // Validate that all required class details are provided
  if (!class_name || !instructor_name || !time || !day || !max_capacity) {
    return res.status(400).send('Missing required class information');
  }
  // Handle the errors
  try {
    // Establish connection
    const connection = await mysql.createConnection(dbConfig);
    // SQL query for updating the specified class record
    const query = `
      UPDATE classes 
      SET class_name = ?, instructor_name = ?, time = ?, day = ?, max_capacity = ?
      WHERE id = ?`;
    // Execute the query
    await connection.execute(query, [class_name, instructor_name, time, day, max_capacity, id]);

    const [booking_emails] = await connection.execute('SELECT email_address FROM bookings WHERE class_name = ?', [class_name]);

    // Loop over each booking email and insert a notification for each
    for (let i = 0; i < booking_emails.length; i++) {
      // Extract the email address from the current booking email object
      const email = booking_emails[i].email_address;
      console.log(email);

      // For each email, insert a new notification into the notifications table
      await connection.execute('INSERT INTO notifications (type, class_name, email_address) VALUES (?, ?, ?)', [type, class_name, email]);
    }

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
  const { id } = req.params;
  const type = 'cancel';

  try {
    const connection = await mysql.createConnection(dbConfig);
    // Correctly extracting class name
    const [classes] = await connection.execute('SELECT class_name FROM classes WHERE id = ?', [id]);
    if (classes.length === 0) {
      return res.status(404).send('Class not found');
    }
    const className = classes[0].class_name;

    // First, fetch emails for notifications before deleting
    const [booking_emails] = await connection.execute('SELECT email_address FROM bookings WHERE class_name = ?', [className]);

    // Then, delete bookings
    await connection.execute('DELETE FROM bookings WHERE class_name = ?', [className]);

    // Proceed to delete the class
    await connection.execute('DELETE FROM classes WHERE id = ?', [id]);

    // Loop over each booking email and insert a notification for each
    for (let email of booking_emails) {
      await connection.execute('INSERT INTO notifications (type, class_name, email_address) VALUES (?, ?, ?)', [type, className, email.email_address]);
    }

    await connection.end();
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Failed to delete class:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Endpoint for handling user registration
// POST BOOKING METHOD
app.post('/bookClass', async (req, res) => {
  // Destructure class_name, email_address, class_id, and date from the request body
  const { class_name, email_address, date } = req.body;
  console.log(req.body);

  // Check if class_name, email_address, class_id, or date is missing
  if (!class_name || !email_address || !date) {
    return res.status(400).send('Missing required booking information');
  }
  try {
    // Establish connection to database
    const connection = await mysql.createConnection(dbConfig);

    // Execute query to ensure provided email address exists in the members table
    const [members] = await connection.execute(
      'SELECT email_address FROM members WHERE email_address = ?',
      [email_address]
    );

    // If member not found, close connection and return an error
    if (members.length === 0) {
      await connection.end();
      return res.status(404).send('Email address not found in members');
    }

    // If member found, create a new booking record with the correct class_name, class_id, and date
    await connection.execute(
      'INSERT INTO bookings (class_name, email_address, date) VALUES (?, ?, ?)',
      [class_name, email_address, date]
    );

    // Close connection
    await connection.end();

    res.json({ message: 'Booking successful' });
  } catch (error) {
    console.error('Error during booking:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET bookings- To display details of all bookings
app.get('/bookingsDisplay', async (req, res) => {
  try {
    const { searchTerm, sort } = req.query; // Capture sort parameter from query
    const searchTermLower = searchTerm ? searchTerm.toLowerCase().trim() : null;

    // Establish connection to MySQL database
    const connection = await mysql.createConnection(dbConfig);

    // SQL query to select all bookings
    let query = 'SELECT * FROM bookings';

    // If search term is provided, add WHERE clause to filter results by class name or email address
    if (searchTermLower) {
      query += ' WHERE LOWER(class_name) LIKE ? OR LOWER(email_address) LIKE ?';
    }

    // Add sorting functionality if sort parameter is provided
    if (sort) {
      query += ` ORDER BY ${sort}`;
    }

    // Parameter for SQL query based on search terms
    const params = searchTermLower ? [`%${searchTermLower}%`, `%${searchTermLower}%`] : [];
    // Execute query
    const [bookings] = await connection.execute(query, params);

    // Close db connection
    await connection.end();

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE booking method
app.delete('/deleteBooking/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // SQL query to delete a booking by ID
    const query = 'DELETE FROM bookings WHERE id = ?';

    // Execute the query
    await connection.execute(query, [id]);
    await connection.end();

    // Respond to the client
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Failed to delete booking:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET Dashboard Data
app.get('/dashboard', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const queries = {
      totalMembers: 'SELECT COUNT(*) AS total FROM members',
      totalBookings: 'SELECT COUNT(*) AS total FROM bookings',
      totalClasses: 'SELECT COUNT(*) AS total FROM classes',
      genders: 'SELECT gender, COUNT(*) AS count FROM members GROUP BY gender',
      memberships: 'SELECT type_of_membership, COUNT(*) AS count FROM members GROUP BY type_of_membership',
      mostBooked: 'SELECT class_name, COUNT(*) AS count FROM bookings GROUP BY class_name ORDER BY count DESC',
      membersTimeline: `SELECT year,
                        SUM(yearly_total) OVER (ORDER BY year ASC) AS cumulative_total
                        FROM (
                        SELECT YEAR(start_date) AS year, COUNT(*) AS yearly_total
                        FROM members
                        GROUP BY YEAR(start_date)
                        ) AS yearly_totals
                        ORDER BY year`,
      totalPayments: 'SELECT COUNT(*) AS total, SUM(amount) AS totalAmount FROM payments',
      paymentsByYear: `SELECT YEAR(payment_date) AS year, COUNT(*) AS total, SUM(amount) AS totalAmount
                                         FROM payments
                                         GROUP BY YEAR(payment_date)
                                         ORDER BY YEAR(payment_date)`,
      paymentsByMonth: `SELECT YEAR(payment_date) AS year, MONTH(payment_date) AS month, COUNT(*) AS total, SUM(amount) AS totalAmount
                                          FROM payments
                                          GROUP BY YEAR(payment_date), MONTH(payment_date)
                                          ORDER BY YEAR(payment_date), MONTH(payment_date)`
    };


    // Execute all queries in parallel for efficiency
    // Reference: https://stackoverflow.com/questions/29292921/how-to-use-promise-all-with-an-object-as-input
    const results = await Promise.all(Object.values(queries).map(query => connection.query(query)));
    await connection.end();
    // Map query results to their respective keys
    // Object.keys(queries)- retrives an array of all the keys in the quaries object
    // The 'reduce' method iterates over each element of the array 
    // acc- value returned by previous iteration or initial value if first iteration
    const response = Object.keys(queries).reduce((acc, key, index) => {
      acc[key] = results[index][0]; // Assigning a value to the 'acc' object using key and corresponding value from results
      return acc; // Return updated 'acc' object
    }, {});

    res.json(response);
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Display Member Details Endpoint
app.get('/displayMember', async (req, res) => {
  // Retrive token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send('No token provided');
  }

  try {
    // Verify and decode the provided JWT using a secret key
    const decoded = jwt.verify(token, 'your_secret_key');
    // Extract email from token
    const userEmail = decoded.email;

    // Establish connection to databse
    const connection = await mysql.createConnection(dbConfig);

    // Select all columns from the 'members' table where the email address matches the user's email.
    const memberQuery = 'SELECT * FROM members WHERE email_address = ?';
    const [memberRows] = await connection.execute(memberQuery, [userEmail]);

    // Checks if any member records were found.
    if (memberRows.length > 0) {
      // If a member is found, queries the 'bookings' table for records related to the member's email.
      const bookingsQuery = 'SELECT * FROM bookings WHERE email_address = ?';
      const [bookingRows] = await connection.execute(bookingsQuery, [userEmail]);

      // If found queries the 'notifications' table for records related to the member's email.
      notifQuery = 'SELECT * FROM notifications WHERE email_address = ?';
      const [notifRows] = await connection.execute(notifQuery, [userEmail]);

      // Combine member details with their bookings and notifications
      const response = {
        memberDetails: memberRows[0],
        bookings: bookingRows,
        notifs: notifRows
      };

      // Send the combined details as a response
      res.json(response);
    } else {
      res.status(404).send('Member not found');
    }

    // Close the database connection
    await connection.end();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).send('Invalid token');
    } else {
      console.error('Database connection or operation failed:', error);
      res.status(500).send('Internal Server Error');
    }
  }
});

// Delete notifications endpoint
app.delete('/deleteNotification/:id', async (req, res) => {
  // Retrive id
  const { id } = req.params;
  console.log(req.params);
  try {
    // Establish connection to database
    const connection = await mysql.createConnection(dbConfig);

    // SQL query to delete a booking by ID
    const query = 'DELETE FROM notifications WHERE id = ?';

    // Execute the query
    await connection.execute(query, [id]);
    await connection.end();

    // Respond to the client
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Failed to delete notification:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
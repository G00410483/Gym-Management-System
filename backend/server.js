const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
const PORT = 3001;

// Enable CORS middleware using the cors() function
app.use(cors());

app.use(bodyParser.json());

const users = [{ id: "1", email: "user@example.com", password: "$2b$10$KPFpcEqFxVTpDrfE.MjtIeKGMxVL6XnxfjWIQBaIN8.qfv0iW/aka" }];

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(user => user.email === email);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

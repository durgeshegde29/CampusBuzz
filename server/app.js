const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'Psd1290@',
  database: 'demo'
});

client.connect();

// Sign up route
app.post('/signup', async (req, res) => {
  const userData = req.body;

  try {
    const query = `
      INSERT INTO Users (registration_no, name, dob, password)
      VALUES ($1, $2, $3, $4)
      RETURNING registration_no`;
    const values = [
      userData.registration_no,
      userData.name,
      userData.dob,
      userData.password,
    ];

    const result = await client.query(query, values);
    const insertedUserId = result.rows[0].registration_no;

    res.status(201).json({
      message: 'User signed up successfully!',
      userId: insertedUserId,
    });
  } catch (error) {
    console.error('Error signing up user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign in route
app.post('/signin', async (req, res) => {
  const { registrationNo, password } = req.body;

  try {
    const { rows } = await client.query('SELECT * FROM Users WHERE registration_no = $1 AND password = $2', [registrationNo, password]);

    if (rows.length > 0) {
      res.status(200).json({ registrationNo: registrationNo }); // Send registration number as JSON
    } else {
      res.status(401).send('Invalid registration number or password.');
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal server error.');
  }
});

// Admin sign in route
app.post('/admin', async (req, res) => {
  const { admin_id, password } = req.body;

  try {
    const { rows } = await client.query('SELECT * FROM admin WHERE admin_id = $1 AND password = $2', [admin_id, password]);

    if (rows.length > 0) {
      res.status(200).json({ redirectUrl: '/admin/home.html' });
    } else {
      res.status(401).send('Invalid admin ID or password.');
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal server error.');
  }
});

// Fetch events route
app.get('/events', async (req, res) => {
  const { filter } = req.query; // Get filter from query params

  let filterQuery = '';
  let queryParams = [];

  if (filter === 'paid') {
    filterQuery = 'WHERE events.fee > 0';
  } else if (filter === 'free') {
    filterQuery = 'WHERE events.fee = 0';
  }

  try {
    const eventsQuery = `
      SELECT events.*, COUNT(registrations.event_id) AS registration_count
      FROM events
      LEFT JOIN registrations ON events.event_id = registrations.event_id
      ${filterQuery}
      GROUP BY events.event_id
    `;
    const { rows } = await client.query(eventsQuery, queryParams);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Internal server error.');
  }
});

// Get count of events route
app.get('/event-count', async (req, res) => {
  try {
    const { rows } = await client.query('SELECT COUNT(event_id) FROM events');
    const count = rows[0].count;
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching event count:', error);
    res.status(500).send('Internal server error.');
  }
});

// Speaker fetch
app.get('/speakers', async (req, res) => {
  try {
    const { rows } = await client.query(`
      SELECT speakers.speaker_name, events.event_name
      FROM speakers
      INNER JOIN events ON speakers.event_id = events.event_id
    `);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error retrieving speaker details:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register for event route
app.post('/register', async (req, res) => {
  const { event_id, registration_no } = req.body;
  if (!event_id || !registration_no) {
      return res.status(400).json({ message: 'Event ID and registration number are required.' });
  }
  try {
      const query = `
          INSERT INTO registrations (registration_no, event_id)
          VALUES ($1, $2)
      `;
      await client.query(query, [registration_no, event_id]);

      // Insert into notifications
      const eventNameQuery = 'SELECT event_name FROM events WHERE event_id = $1';
      const { rows } = await client.query(eventNameQuery, [event_id]);
      const eventName = rows[0].event_name;
      
      const insertQuery = `
          INSERT INTO notifications (registration_no, message, created_at)
          VALUES ($1, $2, CURRENT_TIMESTAMP)
      `;
      const notificationMessage = `You have registered for the event: ${eventName}`;
      await client.query(insertQuery, [registration_no, notificationMessage]);
      
      res.status(200).json({ message: 'Successfully registered for the event.' });
  } catch (error) {
      console.error('Error registering for event:', error);

      if (error.code === '23505') { // Unique violation error code for PostgreSQL
          return res.status(409).json({ message: 'You have already registered for this event.' });
      }

      res.status(500).send('Internal server error.'); 
  }
});

// Fetch notifications for a user route
app.get('/notifications', async (req, res) => {
  const { registrationNo } = req.query;
  if (!registrationNo) {
    return res.status(400).json({ message: 'Registration number is required.' });
  }
  try {
    const { rows } = await client.query('SELECT * FROM notifications WHERE registration_no = $1 ORDER BY created_at DESC', [registrationNo]);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Internal server error.');
  }
});

// Other routes (e.g., fetching data, etc.)

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

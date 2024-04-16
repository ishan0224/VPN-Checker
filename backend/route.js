const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors package
const { isVpn, initialize } = require('./vpn'); 
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

initialize()
  .then(() => {
    app.post('/check-vpn', (req, res) => {
      try {
        const { ip } = req.body;

        if (!ip) {
          return res.status(400).json({ error: 'IP address is required in the request body' });
        }

        const isInVpn = isVpn(ip);

        const result = {
          ip,
          isInVpn
        };

        res.json(result);
      } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error initializing interval tree:', error);
  });

  // 59.14.67.249/32
  // 192.241.217.36/32
  // 94.103.124.98/32
  // 192.241.217.35/32
  // 43.131.249.200/32
  // 43.163.196.78/32
  // 68.174.30.245/32
  // 220.82.166.157/32
  // 223.68.169.181/32
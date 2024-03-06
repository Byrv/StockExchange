const app = require('./app'); // Import the Express application
const port = process.env.PORT || 4000; // Port the server will listen on
require('dotenv').config();

app.listen(port, () => {
  console.log(`Stock Exchange App listening at http://localhost:${port}`);
});

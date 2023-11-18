const cors = require('cors');
const express = require('express');
const app = express();

// Use CORS middleware
app.use(cors());

// Serve your static files, including recommendations.json
app.use(express.static('/Users/ameliarubin/Desktop/PL-gen'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

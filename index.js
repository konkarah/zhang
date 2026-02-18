const express = require('express');
const bodyParser = require('body-parser');
const membersRouter = require('./routes/members');

const app = express();
app.use(bodyParser.json());

app.use('/api/members', membersRouter);

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

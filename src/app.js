const express = require('express');
const registerRoutes = require('./routes/register');

const app = express();

app.use(express.json());
app.use('/api', registerRoutes);

module.exports = app;

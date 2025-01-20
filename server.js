const express = require('express');
const passport = require('./config/googleOAuth');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const shortUrlroutes = require('./routes/shortUrlRoute')
const urlAnalyticsroutes = require('./routes/urlAnalyticsRoutes')
const app = express();
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/api',shortUrlroutes)
mongoose
.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

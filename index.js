const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoute = require('./api/auth');
const dataRoutes = require('./api/data');

const app = express();
require('dotenv').config();


app.use(express.json());

app.use(cors({ origin: process.env.ACCESS_URI, credentials: true }));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB is connected"))
.catch((err) => console.log(err));

app.use('/auth', authRoute);
app.use('/data' , dataRoutes);  

app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT || 8000}`);
});

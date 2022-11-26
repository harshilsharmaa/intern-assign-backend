const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// middleware

const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Server is running');
})

// Rooutes
const userRouter = require('./routers/user.router');
app.use('/api/v1/user', userRouter);

module.exports = app;
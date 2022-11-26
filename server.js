const dotenv = require('dotenv');
dotenv.config({path: './config/.env'});

const app = require('./app');

// Database connection
const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})
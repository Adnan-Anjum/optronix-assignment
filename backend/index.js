import express from "express";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import router from "./routes/urls.js";
import pool from "./config/database.js";
import { CustomersSchema } from "./models/CustomersSchema.js";


// CREATING EXPRESS APP INSTANCE
const app = express();


// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config({path: './.env'});


// MIDDLEWARE SETUP
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());


// CORS CONFIGURATION
const corsOption = {
    origin:"http://localhost:5173",
    credentials : true
}
app.use(cors(corsOption));



// CONFIGURE ROUTES
app.use('/req',router);



// DATABASE CONNECTION 
pool.connect((err, client, release) => {
    if (err) {
        return console.log('Error connecting to Neon:', err.stack);
    }
    console.log('Connected to Neon PostgreSQL');
    release();
});

// CREATE SERVER
const server = http.createServer(app);
server.listen(process.env.PORT,()=>{
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});


// await CustomersSchema();
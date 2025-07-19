import pool from "../config/database.js";

export const CustomersSchema=async ()=>{
    const query = `
        CREATE TABLE IF NOT EXISTS customers(
            uid TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            phone TEXT NOT NULL,
            gender TEXT NOT NULL,
            dob TEXT NOT NULL,
            address TEXT NOT NULL,
            latitude REAL DEFAULT NULL,
            longitude REAL DEFAULT NULL,
            deviceinfo JSONB DEFAULT '{}',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `

    await pool.query(query).then((res)=>{
        console.log('Customers Table Created Successfully');
    }).catch((err)=>{
        console.log('Customers Table Creation Failed');
    })
}


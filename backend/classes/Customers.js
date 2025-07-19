import { v4 as uuidv4 } from "uuid";

import pool from "../config/database.js";

export class Customers{
    constructor(payload){
        this.uid = uuidv4();
        this.name = payload?.fullName;
        this.email = payload?.email;
        this.password = payload?.password;
        this.phone  = payload?.phoneNumber;
        this.gender = payload?.gender;
        this.dob = payload?.dateOfBirth;
        this.address = payload?.address;
        this.latitude = payload?.latitude;
        this.longitude = payload?.longitude;
        this.deviceinfo = JSON.stringify(payload?.deviceInfo);
    }

    async createCustomer(){
        const query = `
            INSERT INTO customers(uid,name,email,password,phone,gender,dob,address,latitude,longitude,deviceinfo)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb) RETURNING *
        `
        const status =  await pool.query(query,[this.uid,this.name,this.email,this.password,this.phone,this.gender,this.dob,this.address,this.latitude,this.longitude,this.deviceinfo]);

        return status.rows[0];
    }
}
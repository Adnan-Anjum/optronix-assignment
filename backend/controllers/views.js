import { Customers } from "../classes/Customers.js";




export const registerCustomer = async (req,res,next)=>{
    const payload = req.body;
    const customerObject = new Customers(payload);
    const record = await customerObject.createCustomer();
    return res.status(200).json({status:true,record});
    
}
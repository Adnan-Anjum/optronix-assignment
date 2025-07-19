import express from 'express';
import { registerCustomer } from '../controllers/views.js';


const router = express.Router();

    router.route('/v1/client/register').post(registerCustomer);


export default router;



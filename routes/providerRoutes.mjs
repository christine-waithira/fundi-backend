import express from 'express';
import { getAllProviders, registerProvider } from '../controllers/providerController.mjs';

const router = express.Router();

//: GET providers -> Fetches all professionals
router.get('/', getAllProviders);

//  Path 2: POST /providers -> Registers a new professional
router.post('/', registerProvider);

export default router;
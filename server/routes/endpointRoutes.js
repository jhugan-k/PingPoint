import express from 'express';
import { getEndPoints, createEndPoint } from '../controllers/endpointController.js';
const router = express.Router();
router.route('/').get(getEndPoints).post(createEndPoint);
export default router;

import express from 'express';
// Using your exact function names
import {
  getEndPoints,
  createEndPoint,
  getEndpointById,
  updateEndPoint,
  deleteEndPoint,
} from '../controllers/endpointController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getEndPoints) // Uses getEndPoints
  .post(protect, createEndPoint); // Uses createEndPoint

router.route('/:id')
  .get(protect, getEndpointById)
  .put(protect, updateEndPoint) // Uses updateEndPoint
  .delete(protect, deleteEndPoint); // Uses deleteEndPoint

export default router;
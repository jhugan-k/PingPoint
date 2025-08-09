import express from 'express';
import{
    getEndPoints,
    getEndpointById,
    updateEndPoint,
    deleteEndPoint,
    createEndPoint,

} from '../controllers/endpointController.js';

const router = express.Router();
router.route('/').get(getEndPoints).post(createEndPoint);

router
    .route('/:id')
    .get(getEndpointById)
    .put(updateEndPoint)
    .delete(deleteEndPoint);

export default router;

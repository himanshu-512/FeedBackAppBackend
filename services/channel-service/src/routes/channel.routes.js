import express from 'express';
import {
  listChannels,
  createChannel,
  joinChannel
} from '../controllers/channel.controller.js';
 import verifyJWT  from '../../mid/ver.js';

const router = express.Router();

router.get('/all', listChannels);
router.post('/createChannel', createChannel);
router.post('/:id/join',verifyJWT, joinChannel);

export default router;

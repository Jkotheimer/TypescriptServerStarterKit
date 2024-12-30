/**
 * v1
 * @version 1.0.0
 */
import express from 'express';
import UsersApiV1 from '@api/v1/users/index';

const router = express.Router();

router.use('/users', UsersApiV1);

export default router;

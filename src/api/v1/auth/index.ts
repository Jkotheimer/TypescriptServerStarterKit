import express, { Request, Response } from 'express';
import UserRepository from '@database/user-repository';
import { DatabaseError, RequestError } from '@models/errors';
import Constants from '@constants';
import User from '@models/user';

const router = express.Router();

/**
 * @description Fetch User Details by ID
 * @param request
 * @param response
 */
async function login(request: Request, response: Response) {
    try {
        const payload = await User.from(request.body);
        const user = await UserRepository.getUserForAuthentication(request.params.id);

        response.status(200).json({
            message: 'Success',
            data: user
        });
    } catch (error) {
        console.error(error);
        let errorMessage = error instanceof Error ? error.message : Constants.ERROR_MESSAGES.UNEXPECTED;
        let statusCode = Constants.HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
        if (error instanceof RequestError) {
            if (error.statusCode) {
                statusCode = error.statusCode;
            }
        }
        response.status(statusCode).send({
            message: errorMessage
        });
    }
}

router.post('/login', login);

export default router;

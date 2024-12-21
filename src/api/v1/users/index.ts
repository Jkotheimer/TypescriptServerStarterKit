import express, { Request, Response } from 'express';

const router = express.Router();

/**
 * @description Fetch User Details by ID
 * @param request
 * @param response
 */
function getUserById(request: Request, response: Response) {
    console.log(request.params);
    response.status(200).json({
        message: 'Success'
    });
}

function createUser(request: Request, response: Response) {
    const payload = request.body;
    console.log('CREATE USER', payload);
    response.status(201).json({
        message: 'Success'
    });
}

router.get('/:id', getUserById);
router.post('/', createUser);

export default router;

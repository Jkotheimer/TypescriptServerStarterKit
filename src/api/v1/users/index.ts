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

/**
 * @description Create a user record.
 * Inputs:
 * - Valid CSRF token
 * - Valid ReCaptcha token
 * - JSON User payload
 * Logic:
 * - Validate CSRF token
 * - Validate ReCaptcha token
 * - Ensure all required fields and no extra fields are present
 * - Ensure unique email
 * - Ensure secure password
 * - Create User record
 * Outputs:
 * - Record Id
 * - Auth Token
 * - CSRF Token
 * @param request
 * @param response
 */
function createUser(request: Request, response: Response) {
    const payload = request.body;
    console.log('CREATE USER', payload);
    response.status(201).json({
        message: 'Success'
    });
}

/**
 * @description Create a user record.
 * Inputs:
 * - Valid CSRF token
 * - Valid ReCaptcha token
 * - JSON User payload (diff)
 * Logic:
 * - Validate CSRF token
 * - Validate ReCaptcha token
 * - Ensure only valid fields are present in payload
 * - Ensure unique email
 * - Ensure secure password
 * - Create User record
 * Outputs:
 * - Record Id
 * - Auth Token
 * - CSRF Token
 * @param request
 * @param response
 */
function updateUser(request: Request, response: Response) {
    const payload = request.body;
    console.log('UPDATE USER', payload);
    response.status(200).json({
        message: 'Success'
    });
}

router.post('/', createUser);
router.get('/:id', getUserById);
router.patch('/:id', updateUser);

export default router;

/**
 * This file defines all exposed api endpoints
 */
import express, { Request, Response } from 'express';
//import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import Constants from '@constants';
//import User from '@models/user';

// Create a mock in-memory database for users
//const usersDb: Record<string, { firstName: string; lastName: string; email: string; password: string }> = {};

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.get('/hello', async (_: Request, res: Response) => {
    res.status(200).json({
        message: 'Hello, world!',
    });
});

// POST /users - Create a new user
/*
app.post('/users', async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    if (usersDb[email]) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the new user in the mock database
    usersDb[email] = { firstName, lastName, email, password: hashedPassword };

    return res.status(201).json({ message: 'User created successfully' });
});

// POST /login - Log in the user
app.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ error: 'Email and password are required' });
    }

    // Find the user by email
    const user = usersDb[email];
    if (!user) {
        return res.status(400).json({ error: 'User not found' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: 'Invalid password' });
    }

    return res.status(200).json({ message: 'Login successful' });
});

// GET /users/{id} - Fetch user details by ID
app.get('/users/:id', (req: Request, res: Response) => {
    const userId = req.params.id;

    // Fetch the user by email (using email as user ID for simplicity)
    const user = usersDb[userId];
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Return user details excluding the password
    const { password, ...userDetails } = user;
    return res.status(200).json(userDetails);
});

*/
// Start the server
app.listen(Constants.PORT, () => {
    console.log(`Server is running on http://localhost:${Constants.PORT}`);
});

/**
 * This file defines all exposed api endpoints
 */
import Express from 'express';
import Constants from '@constants';
import UsersAPI from '@api/v1/users/index';

// Initialize Express app
const app = Express();

// Parse all request bodies as JSON
app.use(
    Express.json({
        inflate: true,
        strict: true,
        limit: '1mb'
    })
);

// Define all APIs
app.use('/users', UsersAPI);

// Start the server
app.listen(Constants.PORT, () => {
    console.log(`Server is running on http://localhost:${Constants.PORT}`);
});

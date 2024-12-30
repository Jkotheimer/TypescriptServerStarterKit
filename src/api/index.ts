/**
 * This file defines all exposed api endpoints
 */
import Express from 'express';
import Constants from '@constants';
import v1 from '@api/v1/index';

const versions: Record<string, Express.Router> = {
    v1
};

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

Object.keys(versions).forEach((vx) => app.use(`/${vx}`, versions[vx]));

// Start the server
app.listen(Constants.PORT, () => {
    console.log(`Server is running on http://localhost:${Constants.PORT}`);
});

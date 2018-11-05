import server from './server';

const port: number = parseInt(process.env.PORT || '3000', 10);

// When the server starts up, we should start another process to
// clean up expired keys on an in interval.

// Serve the application at the given port
server.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`);
});
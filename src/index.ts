import Server from "./server";
import dotenv from "dotenv";

/**
 * Main 
 */
function main(): void {

    // Config envirement
    dotenv.config({
        path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production'
    });

    // Create instance from server
    const server: Server = new Server();

    // Start server
    server.run();
}

// Start server
main();
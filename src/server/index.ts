import http, { IncomingMessage, ServerResponse } from "http";
import Routes from "./routes";
import { METHOD_OPTIONS } from "../helpers/contants";

/**
 * Server
 * 
 * @extends {Route}
 */
export default class Server extends Routes {

    private readonly engine: http.Server;

    /**
     * Server 
     * 
     * @constructor
     */
    constructor() {
        super();

        // Destructuring assignment
        const { requestListener }: Server = this;

        // Creating server
        this.engine = http.createServer(requestListener);
    }

    /**
     * Request Listener
     * 
     * @description Pointer start from all request to this server
     * @param {IncomingMessage} request 
     * @param {ServerResponse} response 
     */
    private requestListener(request: IncomingMessage, response: ServerResponse): void {
        
        // Preflight (cors)
        if(request.method === METHOD_OPTIONS) super.preflight(request, (statusCode: number, origin?: string | string[]) => {

            if(Array.isArray(origin)) {
                let newOrigin = "";

                origin.forEach((originCurrent, index) => {
                    if(index > 0) newOrigin += `,${originCurrent}`;
                    else newOrigin += originCurrent;
                });

                origin = newOrigin;
            }
            
            // Write head from response
            response.writeHead(statusCode, {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Origin': origin || "*"
            });

            response.end();
        });

        // Main request
        else super.binding(request, (statusCode: number, origin?: string | string[], body?: any) => {

            if(Array.isArray(origin)) {
                let newOrigin = "";

                origin.forEach((originCurrent, index) => {
                    if(index > 0) newOrigin += `,${originCurrent}`;
                    else newOrigin += originCurrent;
                });

                origin = newOrigin;
            }

            if(!Buffer.isBuffer(body)) {
                if(typeof body === "object") body = Buffer.from(JSON.stringify(body));
                else body = Buffer.from(body);
            }

            // Write head froom response
            response.writeHead(statusCode, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': origin || "*"
            });

            // Send result data
            response.end(body);

        });

    }

    /**
     * Run 
     * 
     * @description Start server
     * @param {() => void | undefined} callback
     */
    public run(callback?: () => void): void {
        const { engine }: Server = this;

        let port: number = Number(process.env.SERVER_PORT || 3040);
        let ip: string = process.env.SERVER_IP || "0.0.0.0";
	
	console.log("[ SERVER ] port:", port);
	console.log("[ SERVER ] ip:", ip);

        engine.listen(port, ip, callback);

    }

}
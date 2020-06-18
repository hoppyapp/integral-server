import http, { IncomingMessage, ServerResponse } from "http";
import Routes from "./routes";
import { METHOD_OPTIONS } from "../helpers/contants";

/**
 * Server
 */
export default class Server extends Routes {

    private readonly engine: http.Server;

    constructor() {
        super();

        // Destructuring assignment
        const { requestListener }: Server = this;

        // Bind methods
        // this.requestListener = this.requestListener.bind(this);
        // this.originAllowed = this.originAllowed.bind(this);

        // Creating server
        this.engine = http.createServer(requestListener);
    }

    /**
     * Request Listener
     * 
     * Pointer start from all request to this server
     * 
     * @param {IncomingMessage} request 
     * @param {ServerResponse} response 
     */
    private requestListener(request: IncomingMessage, response: ServerResponse): void {
        
        // Preflight
        if(request.method === METHOD_OPTIONS) super.preflight(request, (statusCode: number, origin?: string) => {
            
            // Write head from response
            response.writeHead(statusCode, {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Origin': origin || "*"
            });

            response.end();
        });

        // Main request
        else super.binding(request, (statusCode: number, origin?: string, body?: any) => {

            console.log(body);

            if(typeof body === "object") body = Buffer.from(JSON.stringify(body));
            else body = Buffer.from(body);

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
     * Start server
     */
    public run(callback?: () => void): void {
        const { engine }: Server = this;

        let port: number = Number(process.env.SERVER_PORT || 3040);
        let ip: string = process.env.SERVER_IP || "0.0.0.0";

        engine.listen(port, ip, callback);

    }

}
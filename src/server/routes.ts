import { IncomingMessage, IncomingHttpHeaders } from "http";
import { OnResponse, Client, ResponseContent } from "../helpers/utils/types";
import { getQueryFromURL, getPathFromURL } from "../helpers/tools/format";
import { METHOD_POST, METHOD_GET } from "../helpers/contants";
import MundiPagg from "../services/mundipagg";
import fs from "fs";
import FoodService from "../services/food";

/**
 * Routes
 */
export default class Routes {

    protected preflight(request: IncomingMessage, onReponse: OnResponse): void {
        // Destructuring assignment
        const { origin } = request.headers;

        if(origin && !Array.isArray(origin)) {
            if(Routes.originAllowed(origin)) {
                onReponse(200, origin);
            } else {
                onReponse(400, origin);
            }
        }
    }

    /**
     * Binding
     * 
     * @param {IncomingMessage} request 
     * @param {OnResponse} onReponse 
     */
    protected async binding(request: IncomingMessage, onReponse: OnResponse): Promise<void> {
        // Destructuring assignment
        const { method, url, headers }: IncomingMessage = request;
        const { origin }: IncomingHttpHeaders = request.headers;

        console.log(request.headers["content-length"]);

        if(!url) {
            request.connection.destroy();
            return;
        }

        let path: string = getPathFromURL(url);
        let query: any = getQueryFromURL(url);


        switch(method) {

            case METHOD_GET: 

                switch(path) {

                    case "/foods":

                        const service = new FoodService();

                        service.getFoods().then((data: any) => onReponse(200, undefined, data));

                    break;

                }

            break;

            case METHOD_POST:

                let body: Buffer = Buffer.from("", "utf-8");

                switch(path) {

                    /**
                     * Add food to database
                     */
                    case "/foods/add":

                        request.addListener("data", (chunk: Buffer) => {
                            if(chunk.length > 1e6) request.connection.destroy();

                            body = Buffer.concat([ body, chunk ]);
                        });

                        request.addListener("end", async () => {

                            const service = new FoodService();

                            const { status, message}: ResponseContent = await service.addFood(JSON.parse(body.toString()));
                            console.log("message:", message)

                            onReponse(status, origin as string, Buffer.from(JSON.stringify(message), "utf-8"));
                        });

                        break;


                    /**
                     *  
                     */    
                    case "/subscribe/hoopy":

                        if(!query.plan) break;

                        request.addListener("data", (chunk: Buffer) => {
                            body = Buffer.concat([ body, chunk ]);
                        });

                        request.addListener("end", async () => {

                            console.log(body);

                            const service: MundiPagg = new MundiPagg(JSON.parse(body.toString()) as Client);

                            if(query.plan === "standard") await service.payStandardPlan();

                            onReponse(200, origin as string);
                        });

                        break;

                    }

                break;

        }

    }

    /**
     * Origin Allowed
     * 
     * @param {string} requestOrigin 
     */
    private static originAllowed(requestOrigin: string): boolean {
        const origins: string[] = process.env.SERVER_ORIGINS_ALLOW?.split(",") || [];

        console.log(origins);

        for(let origin of origins) if(origin === requestOrigin) return true;

        return false;
    }

}
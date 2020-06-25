import { IncomingMessage, IncomingHttpHeaders } from "http";
import { OnResponse, Client, ResponseData } from "../helpers/utils/types";
import { getQueryFromURL, getPathFromURL } from "../helpers/tools/format";
import { METHOD_POST, METHOD_GET, FOOD_CATEGORIES } from "../helpers/contants";
import MundiPagg from "../services/mundipagg";
import fs from "fs";
import FoodService from "../services/food";

/**
 * Routes
 */
export default class Routes {

    /**
     * Preflight
     * 
     * @description A CORS preflight request is a CORS request that checks to see 
     *  if the CORS protocol is understood and a server is aware using specific methods
     *  and headers.
     * @param {IncomingMessage} request CORS preflight request 
     * @param {OnResponse} onReponse callback to response request
     */
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

        // console.log(request.headers["content-length"]);

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

                        // Service 
                        const service = new FoodService();

                        service.getFoods().then((data: any) => onReponse(200, origin, data));

                    break;

                    /**
                     *  Get categories food
                     */
                    case "/foods/categories":

                        onReponse(200, origin, {
                            categories: FOOD_CATEGORIES
                        });

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

                            const { status, content }: ResponseData = await service.addFood(JSON.parse(body.toString()));

                            onReponse(status, origin as string, Buffer.from(JSON.stringify(content), "utf-8"));
                        });

                        break;


                    /**
                     *  Subscribe hoppy
                     */    
                    case "/subscribe/hoopy":

                        if(!query.plan) break;

                        request.addListener("data", (chunk: Buffer) => {
                            body = Buffer.concat([ body, chunk ]);
                        });

                        request.addListener("end", async () => {

                            console.log("[ CLIENT | MUNDIPAGG ]:", body);

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

        for(let origin of origins) if(origin === requestOrigin) return true;

        return false;
    }

}
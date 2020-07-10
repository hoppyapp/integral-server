import { Client } from "../helpers/utils/types";
import axios, { AxiosResponse } from "axios";

/**
 * MundiPagg API
 */
export default class MundiPagg {

    private static readonly LOG_TAG: string = "[ SERVICE | MundiPagg ]:";

    // Client 
    private readonly client: Client;

    // URL
    private readonly urlOrder: URL = new URL("https://api.mundipagg.com/core/v1/orders/");
    private readonly urlCustomer: URL = new URL("https://api.mundipagg.com/core/v1/customers");

    // Key
    private readonly secretKey: string = Buffer.from("sk_test_vQOyPg5HqHyeG1K4:").toString("base64");

    constructor(client: Client) {

        console.log(`${MundiPagg.LOG_TAG} client - `, client);

        // Set client
        this.client = client;

        // Binding method with this context
        this.existClient = this.existClient.bind(this);
    }

    /**
     * Exists Client
     * 
     * @param {string} email
     * @returns {Promise<string | undefined>}
     */
    private async existClient(email: string): Promise<string | undefined> {
        // Destruturing assignment
        const { urlCustomer, secretKey }: MundiPagg = this;

        const response: AxiosResponse = await axios.get(urlCustomer.toString() + `?email=${email}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + secretKey
            }
        });

        if(response.status !== 200) throw Error("STATUS CODE: " + response.status.toString());

        const responseJson: {
            data: Array<any>;
        } = response.data;

        if(responseJson.data.length > 1) throw Error("ALREADY MORE ONE");

        if(responseJson.data.length !== 1) return undefined;

        return responseJson.data[0].id;
    }

    public async payStandardPlan(): Promise<void> {
        // Destructuring assignment
        const { urlOrder, secretKey, client, existClient }: MundiPagg = this;

        // Body data
        let body: any = {

            // Product
            items: [
                {
                    amount: 20400,
                    description: "PG em CASA",
                    quantity: 1
                }
            ],

            // Payments
            payments: [

                {
                    payment_method: 'credit_card',
                    credit_card: {
                        recurrence: false,
                        installments: 12,
                        statement_descriptor: "PG em CASA",
                        card: {
                            number: client.card.number,
                            holder_name: client.card.holder_name,
                            exp_month: client.card.exp_month,
                            exp_year: client.card.exp_year,
                            cvv: client.card.cvv,
                            billing_address: {
                                line_1: client.customer.address.line_1,
                                line_2: client.customer.address.line_2,
                                zip_code: client.customer.address.zip_code,
                                city: client.customer.address.city,
                                state: client.customer.address.state,
                                country: client.customer.address.country
                            }
                        }
                    }
                }
            ]

        };

        let customerId: string | undefined = (await existClient(client.customer.email));

        if(customerId) {
            body.customer_id = customerId;
        } else {
            body.customer = {
                name: client.customer.name,
                email: client.customer.email                
            };
        }

        try {

            const response: AxiosResponse = await axios.post(urlOrder.toString(), body, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + secretKey
                },
            });

            console.log("===> RESPONSE STATUS:", response.status);

        } catch(e) {
            console.log(e.response.status);
            console.log(e.response.data);
        }

    }

}
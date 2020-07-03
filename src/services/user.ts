import Mongo from "../databases/mongo";
import userSchema from "../databases/mongo/schemas/user";
import { ResponseData, User } from "../helpers/utils/types";
import { Timestamp } from "mongodb";

/**
 * Server Service
 * 
 * @extends {Mongo}
 */
export default class UserService extends Mongo {

    private static readonly LOG_TAG: string = "[ USER SERVICE ]";

    private static readonly DATABASE_NAME: string = "integral";
    private static readonly COLLECTION_NAME: string = "users";

    /**
     * User Service
     * 
     * @constructor 
     */
    constructor() {
        super(UserService.DATABASE_NAME, UserService.COLLECTION_NAME, userSchema);
    }

    /**
     * Login
     * 
     * @param {} data
     */
    // public async login(data: any): Promise<ResponseData> {
    //     try {

    //         return {
    //             status: 200, 
    //             content: {
    //                 name: "logged",
    //                 data: data
    //             }
    //         }

    //     } catch(e) {

    //         return {
    //             status: 500,
    //             content: {
    //                 name: e.name,
    //                 description: e.message
    //             }
    //         }
    //     }
    // }

    /**
     * Register 
     * 
     * @param {} data
     */
    public async register(data: User): Promise<ResponseData> {
        try {

            console.log(data);

            const dataExists: User | null = await super.readOneData<User>({ email: data.email });

            console.log("data exists: " + dataExists);

            if(!dataExists) {
                // data.measures = data.measures.map<any>((m: any) => {

                //     if(m.date) m.date = new Timestamp(m.date, 1);
                //     return m;
                // });

                // console.log(data.measures[0].date);

                await super.createData<User>(data);
            }

            return {
                status: 200, 
                content: {
                    name: "registered",
                    data: dataExists ? dataExists : data
                }
            }

        } catch(e) {

            console.log(e);

            return {
                status: 500,
                content: {
                    name: e.name,
                    description: e.message
                }
            }
        }
    }

}
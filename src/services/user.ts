import Mongo from "../databases/mongo";
import userSchema from "../databases/mongo/schemas/user";
import { ResponseData, User, Measure } from "../helpers/utils/types";
import { ObjectId } from "mongodb";

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
     * Register 
     * 
     * @param {} data
     */
    public async register(data: User): Promise<ResponseData> {
        try {

            console.log(UserService.LOG_TAG, data);

            const dataExists: User | null = await super.readOneData<User>({ email: data.email });

            console.log(UserService.LOG_TAG, "data exists: " + dataExists);

            if(!dataExists) {
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

    /**
     * Add measures
     * 
     * @param {string} userId 
     * @param {Measure[]} measures 
     */
    public async addMeasures(userId: string, data: Buffer): Promise<ResponseData> {
        try {

            /// Measure
            let measures: Measure[] = JSON.parse(data.toString());
            let _id: ObjectId = new ObjectId(userId);

            const user: User | null = await super.readOneData<User>({ _id });

            if(!user) throw Error("User not found");

            measures = measures.filter((m: Measure) => {
                for(let measure of user.measures) {
                    if(m.date.day === measure.date.day && m.date.month === measure.date.month && m.date.year === measure.date.year) {
                        return false;
                    }
                }
                return true;
            });

            user.measures = user.measures.concat(measures);

            await super.updateOneData<User>(_id, { $set: { measures: user.measures }});

            return {
                status: 200,
                content: {
                    name: "Added measure",
                    data: user
                }
            }

        } catch(e) {

            console.error(e);

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
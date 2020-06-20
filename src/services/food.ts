import { Food, ResponseData } from "../helpers/utils/types";
import Mongo from "../databases/mongo";
import foodsSchema from "../databases/mongo/schemas/foods";

/**
 * Food Service
 * 
 * @extends {Mongo}
 */
export default class FoodService extends Mongo {

    private static readonly LOG_TAG: string = "[ FOOD SERVICE ]";

    constructor() {
        super("integral", "foods", foodsSchema);
    }

    /**
     * Add food
     * 
     * @param {Food} data 
     */
    public async addFood(data: Food): Promise<ResponseData> {
        
        try {

            if(await super.alreadyExists<Food>({ name: data.name })) throw Error("Food already exists");

            // Create food in database
            await super.createData(data);

            return {
                status: 200,
                content: {
                    name: "Food added",
                    description: data
                }
            }

        } catch(e) {

            // Log
            console.log("------------------------------------");
            console.log(FoodService.LOG_TAG, data);
            console.log(FoodService.LOG_TAG, `${e}`);
            console.log("------------------------------------");

            // Return error
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
     * Get foods
     */
    public async getFoods(): Promise<ResponseData> {

        try {

            const count: number = await super.getCount();
            const datas: Food[] = await super.readAllData<Food>();

            return {
                status: 200,
                content: {
                    name: "Test",
                    data: datas,
                    count
                }
            };

        } catch(e) {

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
import { Food, ResponseContent } from "../helpers/utils/types";
import Mongo from "../databases/mongo";
import foodsSchema from "../databases/mongo/schemas/foods";

/**
 * Food Service
 * 
 * @extends {Mongo}
 */
export default class FoodService extends Mongo {

    constructor() {
        super("integral", "foods", foodsSchema);
    }

    /**
     * Add food
     * 
     * @param {Food} data 
     */
    public async addFood(data: Food): Promise<ResponseContent> {
        
        try {
            // Create food in database
            await super.createData(data);

            return {
                status: 200,
                message: {
                    name: "Food added",
                    description: data
                }
            }

        } catch(e) {

            console.error("[ FOOD SERVICE ] Try add failed:", e);

            return {
                status: 500,
                message: {
                    name: e.name,
                    description: e.message
                }
            }
        }
    }

    /**
     * Get foods
     */
    public async getFoods(): Promise<Food[]> {

        const datas: Food[] = await super.readAllData<Food>();

        return datas;
    }

}
import { Schema } from "../../../helpers/utils/types";
import { FOOD_CATEGORIES } from "../../../helpers/contants";

/**
 * Food Schema
 * 
 * @type {Schema}
 */
const schema: Schema = {
    bsonType: "object",
    required: [ "name", "portion", "composition", "calories", "category" ],
    properties: {

        // Food name
        name: {
            bsonType: "string",
            minLength: 4,
            maxLength: 60,
            description: "Name field"
        },

        // Food portion
        portion: {
            bsonType: "object",
            required: [ "name", "quantity", "unit" ],
            properties: {
                name: {
                    bsonType: "string",
                    minLength: 4
                },
                quantity: {
                    bsonType: [ "double", "int" ],
                    minimum: 1,
                    description: "Quantity field"
                },
                unit: {
                    enum: [ "g", "ml" ],
                    description: "Unit field"
                }
            }
        },

        // Food composition 
        composition: {
            bsonType: "object",
            required: [ "proteins", "carbs", "lipids", "fibers" ],
            properties: {
                proteins: {
                    bsonType: [ "double", "int" ],
                    description: "Proteins field"
                },
                carbs: {
                    bsonType: [ "double", "int" ],
                    description: "Carbs field"
                },
                lipids: {
                    bsonType: [ "double", "int" ],
                    description: "Lipids field"
                },
                fibers: {
                    bsonType: [ "double", "int" ],
                    description: "Fibers field"
                }
            }
        },

        // Food calories
        calories: {
            bsonType: [ "double", "int" ],
            description: "Calories field"
        },

        // Food category
        category: {
            enum: FOOD_CATEGORIES
        }
    }
}

export default schema;
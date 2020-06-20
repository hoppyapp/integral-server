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
    additionalProperties: false,
    properties: {

        _id: {},

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
                    minimum: 0,
                    description: "Proteins field"
                },
                carbs: {
                    bsonType: [ "double", "int" ],
                    minimum: 0,
                    description: "Carbs field"
                },
                lipids: {
                    bsonType: [ "double", "int" ],
                    minimum: 0,
                    description: "Lipids field"
                },
                fibers: {
                    bsonType: [ "double", "int" ],
                    minimum: 0,
                    description: "Fibers field"
                }
            }
        },

        // Food calories
        calories: {
            bsonType: [ "double", "int" ],
            minimum: 0,
            description: "Calories field"
        },

        // Food category
        category: {
            enum: FOOD_CATEGORIES
        }
    }
}

export default schema;
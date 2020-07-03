import { Schema } from "../../../helpers/utils/types";

/**
 * User schema (jsonSchema)
 * 
 * @constant
 * @type {Schema}
 */
const schema: Schema = {
    bsonType: "object",
    required: [ "name", "email", "platform" ],
    additionalProperties: false,
    properties: {

        // User id
        _id: {
            bsonType: "objectId"
        },

        // User name
        name: {
            bsonType: "string",
            maxLength: 40,
        },

        // User email
        email: {
            bsonType: "string",
            
        },

        // User login platform 
        platform: {
            enum: [ "google", "facebook" ],
            description: "Which platform was used to login"
        },

        // User measures
        measures: {
            bsonType: "array",
            minItems: 1,
            items: {
                bsonType: [ "object" ],
                required: [ "date", "weight", "height" ],
                additionalProperties: false,
                properties: {

                    date: {
                        bsonType: "date"
                    },

                    weight: {
                        bsonType: [ "int", "double" ],
                        description: "Weight in kilogram",
                        minimum: 30,
                        maximum: 300,
                    },

                    height: {
                        bsonType: [ "int", "double" ],
                        description: "Height in centimeter",
                        minimum: 100,
                        maximum: 250,
                    }

                }
            }
        },

    }
}

/**
 * Esporting user schema
 * 
 * @default schema 
 * @exports Schema 
 */
export default schema;
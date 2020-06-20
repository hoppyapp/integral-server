import { Schema } from "../../../helpers/utils/types";

const schema: Schema = {
    bsonType: "object",
    required: [ "username", "fullname", "email", "company" ],
    additionalProperties: false,
    properties: {

        _id: {},

        // Username from admin
        username: {
            bsonType: "string",
            minLength: 4,
            maxLength: 30
        },

        // Fullname from admin
        fullname: {
            bsonType: "string",
            minLength: 4,
            maxLength: 60,
        },

        // Email from admin
        email: {
            bsonType: "string",
            pattern: '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/'
        },

        // Set company from admin
        company: {
            enum: [ "integralmedica", "bioHealth", "Power Gym" ]
        }

    }
}

export default schema;
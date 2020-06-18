
export type OnResponse = (statusCode: number, origin?: string, body?: Buffer) => void;

export type ResponseContent = {
    status: number;
    message: {
        name: string;
        description: any;
    }
} 

/**
 * Schema
 * 
 * @type {Schema}
 */
export type Schema = {
    bsonType: string;
    required: string[];
    properties: any;
}

/**
 * Food
 * 
 * @type {Food}
 */
export type Food = {
    name: string;
    portion: string;
    quantity: number;
    unit: string;
    calories: number;
    proteins: number;
    carbs: number;
    lipids: number;
    fibers: number;
}

/**
 * Plan 
 * 
 * @type {Plan}
 */
export type Plan = {
    code: number;
    value: number;
    discountedValue?: number;
    title: string;
    description: string;
};

/**
 * Client 
 * 
 * @type {Client}
 */
export type Client = {
    customer: Customer;
    card: Card;
};

/**
 * Customer
 * 
 * @type {Customer}
 */
export type Customer = {
    name: string;
    email: string;
    // With the data type string it is easier for the user to enter
    birthdate: Date | string;
    type: "individual" | "company";
    phone: {
        mobile_phone: Phone;
        home_phone?: Phone;
    };
    address: Address;
};

/**
 * Phone
 * 
 * @type {Phone}
 */
export type Phone = {
    country_code: string;
    area_code: string;
    number: string;
};

/**
 * Address
 * 
 * @type {Address}
 */
type Address = {
    line_1: string;
    line_2?: string;
    zip_code: string;
    city: string;
    state: string;
    country: string;
};

/**
 * Card
 * 
 * @type {Card}
 */
type Card = {
    number: string;
    holder_name: string;
    exp_month: number;
    exp_year: number;
    cvv: string;
};
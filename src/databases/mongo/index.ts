import { MongoClient, Db, CommandCursor, Cursor } from "mongodb";
import foodsSchema from "./schemas/foods";
import { Schema } from "../../helpers/utils/types";

/**
 * Mongo Database
 */
export default class Mongo {

    private engine?: Db;
    private readonly name: string;
    private readonly collection: string;
    private readonly schema: Schema;

    constructor(name: string, collection: string, schema: Schema) {
        this.name = name;
        this.collection = collection;
        this.schema = schema;

        this.run = this.run.bind(this);
        this.createData = this.createData.bind(this);
        this.readAllData = this.readAllData.bind(this);
    }

    private async run() {
        // Destructuring assignment
        const { name, collection, schema }: Mongo = this;

        this.engine = (await new MongoClient("mongodb://localhost:27017", {
            useUnifiedTopology: true,
            poolSize: 10
        }).connect()).db(name);

        const commandCurso: CommandCursor = this.engine.listCollections({ name: collection });

        if(!await commandCurso.hasNext()) await this.engine.createCollection(collection, {
            validator: {
                $jsonSchema: schema
            }
        });
    }

    /**
     * Create data
     * 
     * @param {T} data 
     */
    protected async createData<T>(data: T): Promise<void> {
        // Destructuring assignment
        const { engine, run, collection }: Mongo = this;

        // Check if exits engine
        if(!engine) await run();

        // @ts-ignore
        await this.engine.collection(collection).insertOne(data);
    }

    /**
     * Read All Data
     * 
     * @param {T[]} page 
     */
    protected async readAllData<T>(page: number = 0): Promise<T[]> {
        // Destructuring assigment
        const { engine, run, collection }: Mongo = this;

         // Check if exits engine
        if(!engine) await run();

        // @ts-ignore
        const cursor: Cursor<T> = this.engine.collection(collection).find<T>();

        return cursor.map<T>((data: T) => data).toArray();
    }


}
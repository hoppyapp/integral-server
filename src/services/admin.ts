import Mongo from "../databases/mongo";
import schema from "../databases/mongo/schemas/admins";
import { Admin, ResponseData } from "../helpers/utils/types";

export default class AdminService extends Mongo {

    private static readonly LOG_TAG: string = "[ ADMIN SERVICE ]";
    private static readonly DATABASE_NAME: string = "integral";
    private static readonly COLLECTION_NAME: string = "admins";

    constructor() {
        super(AdminService.DATABASE_NAME, AdminService.COLLECTION_NAME, schema);
    }

    public async addAdmin(data: Admin): Promise<ResponseData> {

        try {

            if(await super.alreadyExists<Admin>({ email: data.email })) throw Error("Admin already exists");

            await super.createData<Admin>(data);

            return {
                status: 200,
                content: {
                    name: "Admin created",
                    data: data
                }
            }

        } catch(e) {

            console.log(AdminService.LOG_TAG, data);
            console.log(AdminService.LOG_TAG, e);

            return {
                status: 500,
                content: {
                    name: e.name,
                    description: e.message
                }
            }

        }
    }

    public async getAdmins(): Promise<ResponseData> {

        try {

            const datas: Admin[] = await super.readAllData<Admin>();

            return {
                status: 200,
                content: {
                    name: "Admins list",
                    data: datas,
                }
            }

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
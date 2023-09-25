import { Db, MongoClient } from 'mongodb';

const dbUrl = 'mongodb://localhost:27017/';
const dbName = 'rudby'
const jewelleryCollection = 'jewelleries'
const serialNumberCollection = 'serialNumbers'

let db: Db;

export class SerialNumberRepository {

    constructor() {
        this.connect();
    }

    async connect(): Promise<void> {
        const con = await MongoClient.connect(dbUrl);
        db = con.db(dbName);
    }

    async getSerialNumber(): Promise<number> {
        const serialDoc = await db.collection(serialNumberCollection).findOne({});
        if (serialDoc && serialDoc.current) {
            return serialDoc.current;
        } else {
            await this.initializeSerialNumber();
            return 1;
        }
    }

    async incrementSerialNumber(): Promise<void> {
        await db.collection(serialNumberCollection).updateOne({}, { $inc: { current: 1 } });
    }

    private async initializeSerialNumber(): Promise<void> {
        await db.collection(serialNumberCollection).insertOne({ current: 1 });
    }
}

export let serialNumberRepository = new SerialNumberRepository();

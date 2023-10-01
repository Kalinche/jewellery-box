import { IdentifiableJewellery, Jewellery } from "../model/jewellery.model";
import { Db, MongoClient, ObjectId } from 'mongodb';
import { serialNumberRepository } from "./serial-number-repository";

const dbUrl = 'mongodb://localhost:27017/';

const dbName = 'rudby'
const collection = 'jewelleries'

let db: Db;

export class JewelleryRepository {

    constructor() {
        this.connect()
    }

    async connect(): Promise<void> {
        const con = await MongoClient.connect(dbUrl);
        db = con.db(dbName);
    }

    async addJewellery(jewellery: Jewellery, userId: ObjectId) {
        const serialNumber = await serialNumberRepository.getSerialNumber();

        jewellery.serialNumber = serialNumber;
        await serialNumberRepository.incrementSerialNumber();

        jewellery.jewellerId = userId;

        const result = await db.collection(collection).insertOne(jewellery);
        return result.insertedId;
    }

    async getAllJewelleries(): Promise<IdentifiableJewellery[]> {
        const jewelleries = await db.collection(collection).find<IdentifiableJewellery>({}).toArray();
        return jewelleries;
    }

    async getJewelleryByType(type: string): Promise<IdentifiableJewellery | null> {
        const jewellery = await db.collection(collection)
            .findOne<IdentifiableJewellery>({ type: type });
        return jewellery;
    }

    async getJewelleryByCollection(collectionName: string): Promise<IdentifiableJewellery | null> {
        const jewellery = await db.collection(collection)
            .findOne<IdentifiableJewellery>({ collection: collectionName });
        return jewellery;
    }

    async getJewellery(jewelleryId: ObjectId) {
        const jewellery = await db.collection(collection)
            .findOne<IdentifiableJewellery>({ _id: jewelleryId });
        return jewellery;
    }

    async deleteJewellery(jewelleryId: ObjectId) {
        const jewellery = await db.collection(collection)
            .deleteOne({ _id: jewelleryId });
        return jewellery;
    }

    async updateJewellery(jewellery: IdentifiableJewellery) {
        const { _id, ...jewelleryWithoutId } = jewellery;
        try {
            const result = await db.collection(collection).replaceOne({ _id: new ObjectId(_id) }, jewelleryWithoutId);
            return result;
        } catch (error) {
            console.error('Error updating jewellery:', error);
            throw error;
        }
    }


}

export let jewelleryRepository = new JewelleryRepository()

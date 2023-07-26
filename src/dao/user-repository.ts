import { IdentifiableUser, User } from "../model/user.model";
import { Db, MongoClient, ObjectId } from 'mongodb';

const dbUrl = 'mongodb://localhost:27017/';

const dbName = 'rudby'
const collection = 'users'

let db: Db;

export class UserRepository {

    constructor(){
        this.connect()
    }

    async connect(): Promise<void>{
        const con = await MongoClient.connect(dbUrl);
        db = con.db(dbName);
    }

    async addUser(user: User){
        const res = await db.collection(collection).insertOne(user);
        return res.insertedId
    }
    async getAllUsers(): Promise<IdentifiableUser[]>{
        const users = await db.collection(collection).find<IdentifiableUser>({}).toArray();
        return users;
    }

    async getUserByUsername(username: string): Promise<IdentifiableUser | null> {
        const user = await db.collection(collection)
            .findOne<IdentifiableUser>({ username: username });
        return user;
    }

    async getUser(userId: ObjectId){
        const user = await db.collection(collection)
            .findOne<IdentifiableUser>({ _id: userId });
        return user;
    }
    async deleteUser(userId: ObjectId){
        const user = await db.collection(collection)
            .deleteOne({ _id: userId });
        return user;
    }
    async updateUser(user: IdentifiableUser) {
        const result = await db.collection(collection).replaceOne({ _id: new ObjectId(user._id) }, user);
        return result;
    }

}

export let userRepository = new UserRepository()
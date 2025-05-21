import { Mongo } from "../database/mongo.js";
import { ObjectId } from "mongodb";
import crypto from 'crypto'
import { promisify } from 'util';

const collectionName = 'users'

export default class UsersDataAccess {
    async getUsers(){
        const result = await Mongo.db
        .collection(collectionName)
        .find({ })
        .toArray()

        //console.log(result)

        return result
    }

    async deleteUser(userId){
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(userId) })
        
        //console.log(result)
        return result

    }

    async updateUser(userId, userData) {
        const pbkdf2Async = promisify(crypto.pbkdf2);

        if (userData.password) {
            try {
                const salt = crypto.randomBytes(16);
                const hashedPassword = await pbkdf2Async(
                    userData.password,
                    salt,
                    310000,
                    16,
                    'sha256'
                );

                userData = { ...userData, password: hashedPassword, salt };

                const result = await Mongo.db
                    .collection(collectionName)
                    .findOneAndUpdate(
                        { _id: new ObjectId(userId) },
                        { $set: userData },
                        { returnDocument: 'after' }
                    );

                return result;

            } catch (error) {
                throw new Error('Error during hashing password!');
            }
        } else {
            const result = await Mongo.db
                .collection(collectionName)
                .findOneAndUpdate(
                    { _id: new ObjectId(userId) },
                    { $set: userData },
                    { returnDocument: 'after' }
                );
            return result;
        }
    }

    async getProfessionals() {
        try {
            const professionals = await this.dataAccess.getProfessionals();
            return ok(professionals);
        } catch (error) {
            return serverError(error);
        }
    }

    


    async getUserById(userId) {
        const user = await Mongo.db.collection('users').aggregate([
            { $match: { _id: new ObjectId(userId) } },
            {
            $lookup: {
                from: 'users',            // junta na mesma collection de usuários
                localField: 'professionalId',  // campo do usuário aluno
                foreignField: '_id',           // campo _id do profissional
                as: 'professionalData'         // nome do array que vai vir
            }
            },
            {
            $addFields: {
                professionalId: { $arrayElemAt: ['$professionalData', 0] } // pega o primeiro do array
            }
            },
            {
            $project: {
                password: 0,
                salt: 0,
                professionalData: 0
            }
            }
        ]).toArray();

        return user[0];
    }




    }
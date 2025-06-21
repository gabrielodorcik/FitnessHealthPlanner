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

        // Converte professionalId em ObjectId, se existir
        if (userData.professionalId) {
            userData.professionalId = new ObjectId(userData.professionalId);
        }

        // Converte studentsIds em array de ObjectId, se for array
        if (Array.isArray(userData.studentsIds)) {
            userData.studentsIds = userData.studentsIds.map(id => new ObjectId(id));
        }

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
        return await Mongo.db.collection(collectionName).find({ role: 'profissional' }).toArray()
    }

    async getStudents() {
        return await Mongo.db
            .collection('users')
            .find({ role: 'aluno' })
            .project({ password: 0, salt: 0 }) // opcional: omite dados sensíveis
            .toArray()
    }





    async getUserById(userId) {
  const user = await Mongo.db.collection('users').aggregate([
    {
      $match: { _id: new ObjectId(userId) }
    },
    // Para alunos: buscar dados do profissional
    {
      $lookup: {
        from: 'users',
        localField: 'professionalId',
        foreignField: '_id',
        as: 'professionalData'
      }
    },
    {
      $addFields: {
        professionalId: { $arrayElemAt: ['$professionalData', 0] }
      }
    },
    // Para profissionais: buscar dados dos alunos vinculados via studentsIds
    {
      $lookup: {
        from: 'users',
        localField: 'studentsIds',
        foreignField: '_id',
        as: 'students'
      }
    },
    {
      $project: {
        password: 0,
        salt: 0,
        professionalData: 0 // campo auxiliar temporário
      }
    }
  ]).toArray()

  return user[0]
}


// ...

async getStudentsByIds(ids) {
  const objectIds = ids.map(id => new ObjectId(id))
  const students = await Mongo.db
    .collection(collectionName)
    .find({ _id: { $in: objectIds }, role: 'aluno' })
    .project({ password: 0, salt: 0 }) 
    .toArray()
  return students
}







    }
import { Mongo } from "../database/mongo.js";
import { ObjectId } from "mongodb";


const collectionName = 'exercises'

export default class ExercisesDataAccess {
    async getExercises(){
        const result = await Mongo.db
        .collection(collectionName)
        .find({})
        .toArray()

        //console.log(result)

        return result
    }

    async getAvailableExercises(){
        const result = await Mongo.db
        .collection(collectionName)
        .find({ available: true })
        .toArray()

        //console.log(result)

        return result
    }

    async addExercise(exerciseData) {
        const result = await Mongo.db
        .collection(collectionName)
        .insertOne(exerciseData)

        return result
    }

    async deleteExercise(exerciseId){
        const result = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(exerciseId) })
        
        //console.log(result)
        return result

    }

    async updateExercise(exerciseId, exerciseData) {
            

        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(exerciseId) },
                { $set: exerciseData }
            );
        return result;
            
        }

}
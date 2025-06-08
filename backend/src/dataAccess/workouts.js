import { Mongo } from "../database/mongo.js";
import { ObjectId } from "mongodb";


const collectionName = 'workouts'

export default class WorkoutsDataAccess {
    async getWorkouts(){
        const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
            {
                $lookup: {
                    from: 'workoutItems',
                    localField: '_id',
                    foreignField: 'workoutId',
                    as: 'workoutItems'
                } 
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                } 
            },
            {
                $project: {
                    'userDetails.password': 0,
                    'userDetails.salt': 0,
                }
            },
            {
                $unwind: '$workoutItems'
            },
            {
                $lookup: {
                    from: 'exercises',
                    localField: 'workoutItems.exerciseId',
                    foreignField: '_id',
                    as: 'workoutItems.itemDetails'
                } 
            },
            {
                $group: {
                    _id: '$_id',
                    userDetails: { $first: '$userDetails' },
                    workoutItems: { $push: '$workoutItems' },
                    pickupStatus: { $first: '$pickupStatus' },
                    
                }
            }
        ])
        .toArray()

        return result
    }

    async getWorkoutsByUserId(userId){
        const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
            {
                $match: { userId: new ObjectId(userId) }
            },
            {
                $lookup: {
                    from: 'workoutItems',
                    localField: '_id',
                    foreignField: 'workoutId',
                    as: 'workoutItems'
                } 
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                } 
            },
            {
                $project: {
                    'userDetails.password': 0,
                    'userDetails.salt': 0,
                    'assignedToDetails.password': 0,
                    'assignedToDetails.salt': 0,
                }
            },
            {
                
                $unwind: {
                    path: '$workoutItems',
                    preserveNullAndEmptyArrays: true
                  }

            },
            {
                $lookup: {
                    from: 'exercises',
                    localField: 'workoutItems.exerciseId',
                    foreignField: '_id',
                    as: 'workoutItems.itemDetails'
                } 
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'assignedToId',
                    foreignField: '_id',
                    as: 'assignedToDetails'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    userDetails: { $first: '$userDetails' },
                    workoutItems: { $push: '$workoutItems' },
                    pickupStatus: { $first: '$pickupStatus' },
                    workoutName: { $first: '$workoutName' },
                    assignedToDetails: { $first: '$assignedToDetails' },
                    muscleFocus: { $first: '$muscleFocus' },
                    description: { $first: '$description' },
                    createdAt: {$first: '$createdAt' },
                    type: {$first: '$type' },
                    duration: {$first: '$duration'}
                    
                }
            }
        ])
        .toArray()

        return result
    }

   async addWorkout(workoutData) {
        const { items, ...workoutDataRest } = workoutData;

        workoutDataRest.createdAt = new Date();
        workoutDataRest.pickupStatus = 'Em andamento';
        workoutDataRest.userId = new ObjectId(workoutDataRest.userId);
        workoutDataRest.assignedToId = workoutDataRest.assignedToId
            ? new ObjectId(workoutDataRest.assignedToId)
            : null;

        // Verifica se já existe um treino pendente para o mesmo userId
        const existingPendingWorkout = await Mongo.db
            .collection('workouts')
            .findOne({
                userId: workoutDataRest.userId,
                pickupStatus: 'Em andamento'
            });

        if (existingPendingWorkout) {
            throw new Error('Já existe um treino pendente em andamento para este usuário.');
        }

        // Inserir o treino
        const newWorkout = await Mongo.db
            .collection('workouts')
            .insertOne(workoutDataRest);

        if (!newWorkout.insertedId) {
            throw new Error('Workout não pôde ser inserido!');
        }

        // Preparar os itens com referências
        const workoutId = newWorkout.insertedId;

        const itemsWithRefs = items.map((item) => ({
            ...item,
            exerciseId: new ObjectId(item.exerciseId),
            workoutId,
            label: item.label || null
        }));

        // Inserir os exercícios
        await Mongo.db.collection('workoutItems').insertMany(itemsWithRefs);

        return { workoutId };
    }


    async deleteWorkout(workoutId){
        
        const itemsToDelete = await Mongo.db

        .collection('workoutItems')
        .deleteMany( { workoutId: new ObjectId(workoutId) })
        
        const workoutToDelete = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(workoutId) })

        const result = {
            itemsToDelete, 
            workoutToDelete
        }

        return result
    }

    async updateWorkout(workoutId, workoutData) {
        const result = await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(workoutId) },
                { $set: workoutData }
            );

        return result;     
    }

    async getEditingWorkoutByUserId(userId) {
    const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
            {
                $match: {
                    userId: new ObjectId(userId),
                    pickupStatus: 'Editando'
                }
            },
            {
                $lookup: {
                    from: 'workoutItems',
                    localField: '_id',
                    foreignField: 'workoutId',
                    as: 'workoutItems'
                }
            },
            {
                $lookup: {
                    from: 'exercises',
                    localField: 'workoutItems.exerciseId',
                    foreignField: '_id',
                    as: 'exerciseDetails'
                }
            }
        ])
        .toArray()

    return result;
}


}
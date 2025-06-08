import WorkoutsDataAccess from '../dataAccess/workouts.js'
import { ok, serverError } from '../helpers/httpResponse.js'
import { Mongo } from '../database/mongo.js'
import { ObjectId } from 'mongodb'

export default class WorkoutsControllers {
    constructor() {
        this.dataAccess = new WorkoutsDataAccess()
    }

    async getWorkouts() {
        try {
            const workouts = await this.dataAccess.getWorkouts()
            return ok(workouts)
        } catch (error) {
            return serverError(error)
        }
    }

    async getWorkoutsByUserId(userId) {
        try {
            const workouts = await this.dataAccess.getWorkoutsByUserId(userId)
            return ok(workouts)
        } catch (error) {
            return serverError(error)
        }
    }

    
    
    async addWorkout(workoutData) {
        try {
            // Enviar os dados para o dataAccess, renomeando workoutItems para items
            const result = await this.dataAccess.addWorkout({
                ...workoutData,
                items: workoutData.items // <- Certifique-se de que o front envia como `items`
            });

            return ok(result);
        } catch (error) {
            console.error("Erro ao criar treino:", error); // 👈 Log para debug
            return serverError(error);
        }
    }


    async deleteWorkout(workoutId) {
        try {
            const result = await this.dataAccess.deleteWorkout(workoutId)

            // Também remover exercícios relacionados
            await Mongo.db.collection('workoutItems').deleteMany({ workoutId: new ObjectId(workoutId) })

            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async updateWorkout(workoutId, workoutData) {
        try {
            const result = await this.dataAccess.updateWorkout(workoutId, workoutData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async updateWorkoutStatusController(req, res) {
        try {
            const workoutId = req.params.id
            const { pickupStatus } = req.body

            const workout = await Mongo.db.collection('workouts').findOne({ _id: new ObjectId(workoutId) })

            if (!workout) {
                return res.status(404).json({
                    success: false,
                    statusCode: 404,
                    body: "Treino não encontrado."
                })
            }

            const userId = workout.userId
            const conflictingStatus = pickupStatus === "Editando" ? "Em andamento" : "Editando"

            const existingConflict = await Mongo.db.collection('workouts').findOne({
                _id: { $ne: new ObjectId(workoutId) },
                userId: userId,
                pickupStatus: { $in: [pickupStatus, conflictingStatus] }
            })

            if (existingConflict) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    body: `Já existe outro treino com status "${existingConflict.pickupStatus}". Finalize ou cancele ele antes de alterar outro.`
                })
            }

            const result = await Mongo.db
                .collection('workouts')
                .updateOne(
                    { _id: new ObjectId(workoutId) },
                    { $set: { pickupStatus } }
                )

            if (result.modifiedCount === 0) {
                return res.status(400).json({
                    success: false,
                    statusCode: 400,
                    body: "Status do treino não foi alterado."
                })
            }

            res.status(200).json({
                success: true,
                statusCode: 200,
                body: "Status do treino atualizado com sucesso."
            })

        } catch (error) {
            console.error(error)
            res.status(500).json({
                success: false,
                statusCode: 500,
                body: "Erro ao atualizar status do treino."
            })
        }
    }
}

import WorkoutsDataAccess from '../dataAccess/workouts.js'
import { ok, serverError } from '../helpers/httpResponse.js'

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
            const result = await this.dataAccess.addWorkout(workoutData)
            // console.log(users)
            return ok(result)

        } catch (error) {
            return serverError(error)

        }
    }

    async deleteWorkout(workoutId) {
        try {
            const result = await this.dataAccess.deleteWorkout(workoutId)
            // console.log(users)
            return ok(result)

        } catch (error) {
            return serverError(error)

        }
    }

    async updateWorkout(workoutId, workoutData) {
        try {
            const result = await this.dataAccess.updateWorkout(workoutId, workoutData)
            // console.log(users)
            return ok(result)

        } catch (error) {
            return serverError(error)

        }
    }

    async updateWorkoutStatusController(req, res) {
        try {
            const workoutId = req.params.id
            const { pickupStatus } = req.body

            const result = await Mongo.db
            .collection('workouts')
            .updateOne(
                { _id: new ObjectId(workoutId) },
                { $set: { pickupStatus } }
            )

            if (result.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                body: "Treino não encontrado ou status já está igual."
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
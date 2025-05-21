import ExercisesDataAccess from "../dataAccess/exercises.js";
import { ok, serverError } from '../helpers/httpResponse.js'

export default class ExercisesControllers {
    constructor() {
        this.dataAccess = new ExercisesDataAccess()
    }

    async getExercises() {
        try {
            const exercises = await this.dataAccess.getExercises()
            // console.log(users)
            return ok(exercises)

        } catch (error) {
            return serverError(error)

        }
    }

      async getAvailableExercises() {
        try {
            const exercises = await this.dataAccess.getAvailableExercises()
            // console.log(users)
            return ok(exercises)

        } catch (error) {
            return serverError(error)

        }
    }

    async addExercise(exerciseData) {
        try {
            const result = await this.dataAccess.addExercise(exerciseData)
            // console.log(users)
            return ok(result)

        } catch (error) {
            return serverError(error)

        }
    }

    async deleteExercise(exerciseId) {
        try {
            const result = await this.dataAccess.deleteExercise(exerciseId)
            // console.log(users)
            return ok(result)

        } catch (error) {
            return serverError(error)

        }
    }

    async updateExercise(exerciseId, exerciseData) {
        try {
            const result = await this.dataAccess.updateExercise(exerciseId, exerciseData)
            // console.log(users)
            return ok(result)

        } catch (error) {
            return serverError(error)

        }
    }
}
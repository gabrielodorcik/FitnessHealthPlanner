import express from 'express'
import ExercisesControllers from '../controllers/exercises.js'

const exercisesRouter = express.Router()

const exercisesControllers = new ExercisesControllers()

exercisesRouter.get('/', async (req, res) => {
    const { success, statusCode, body } = await exercisesControllers.getExercises()

    res.status(statusCode).send({ success, statusCode, body })
})

exercisesRouter.post('/', async (req, res) => {
    const { success, statusCode, body } = await exercisesControllers.addExercise(req.body)
    res.status(statusCode).send({ success, statusCode, body })
})

exercisesRouter.delete('/:id', async (req, res) => {
    const { success, statusCode, body } = await exercisesControllers.deleteExercise(req.params.id)
    res.status(statusCode).send({ success, statusCode, body })
})

exercisesRouter.put('/:id', async (req, res) => {
    const { success, statusCode, body } = await exercisesControllers.updateExercise(req.params.id, req.body)
    res.status(statusCode).send({ success, statusCode, body })
})

exercisesRouter.get('/availables/', async (req, res) => {
    const { success, statusCode, body } = await exercisesControllers.getAvailableExercises()

    res.status(statusCode).send({ success, statusCode, body })
})

export default exercisesRouter
import express from 'express'
import WorkoutsControllers from '../controllers/workouts.js'

const workoutsRouter = express.Router()

const workoutsControllers = new WorkoutsControllers

workoutsRouter.get('/', async (req, res) => {
    const { success, statusCode, body } = await workoutsControllers.getWorkouts()

    res.status(statusCode).send({ success, statusCode, body })
})

workoutsRouter.get('/userworkouts/:id', async (req, res) => {
    const { success, statusCode, body } = await workoutsControllers.getWorkoutsByUserId(req.params.id)

    res.status(statusCode).send({ success, statusCode, body })
})

workoutsRouter.post('/', async (req, res) => {
    const { success, statusCode, body } = await workoutsControllers.addWorkout(req.body)
    res.status(statusCode).send({ success, statusCode, body })
})

workoutsRouter.delete('/:id', async (req, res) => {
    const { success, statusCode, body } = await workoutsControllers.deleteWorkout(req.params.id)
    res.status(statusCode).send({ success, statusCode, body })
})

workoutsRouter.put('/:id', async (req, res) => {
    const { success, statusCode, body } = await workoutsControllers.updateWorkout(req.params.id, req.body)
    res.status(statusCode).send({ success, statusCode, body })
})

workoutsRouter.put('/:id', async (req, res) => {
    const { success, statusCode, body } = await workoutsControllers.updateWorkoutStatus(req, res)
    res.status(statusCode).send({ success, statusCode, body })
})

workoutsRouter.get('/editing/:id', async (req, res) => {
    try {
        const workout = await workoutsControllers.dataAccess.getEditingWorkoutByUserId(req.params.userId)
        if(!workout){
            return res.status(404).json({ success: false, statusCode: 404, body: 'Nenhum treino em edição encontrado.' })
        }
        return res.status(200).json({ success: true, statusCode: 200, body: workout })
    } catch (error) {
        return res.status(500).json({ success: false, statusCode: 500, body: error.message })
    }
})

export default workoutsRouter
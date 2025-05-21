import express from 'express'
import UsersControllers from '../controllers/users.js'

const usersRouter = express.Router()

const usersControllers = new UsersControllers()

usersRouter.get('/', async (req, res) => {
    const { success, statusCode, body } = await usersControllers.getUsers()

    res.status(statusCode).send({ success, statusCode, body })
})

usersRouter.get('/:id', async (req, res) => {
  const { success, statusCode, body } = await usersControllers.getUserProfile(req.params.id);
  res.status(statusCode).send({ success, statusCode, body });
});

usersRouter.delete('/:id', async (req, res) => {
    const { success, statusCode, body } = await usersControllers.deleteUser(req.params.id)
    res.status(statusCode).send({ success, statusCode, body })
})

usersRouter.put('/:id', async (req, res) => {
    const { success, statusCode, body } = await usersControllers.updateUser(req.params.id, req.body)
    res.status(statusCode).send({ success, statusCode, body })
})

usersRouter.get('/professionals', async (req, res) => {
  const { success, statusCode, body } = await usersControllers.getProfessionals()
  res.status(statusCode).send({ success, statusCode, body })
})

usersRouter.get('/profile/:id', async (req, res) => {
    const controller = new UsersControllers();
    const result = await controller.getUserProfile(req.params.id);
    res.status(result.statusCode).json(result.body);
});

export default usersRouter
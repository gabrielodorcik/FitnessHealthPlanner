import express from 'express'
import CheckinController from '../controllers/checkins.js'

const router = express.Router()
const controller = new CheckinController()

router.post('/', (req, res) => controller.addCheckin(req, res))
router.get('/user/:userId', (req, res) => controller.getCheckinsByUser(req, res))

export default router

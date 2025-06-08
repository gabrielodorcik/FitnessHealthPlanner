import express from 'express';
import cors from 'cors';
import { Mongo } from './database/mongo.js'; 
import { config } from 'dotenv';
import authRouter from './auth/auth.js';
import usersRouter from './routes/users.js';
import exercisesRouter from './routes/exercises.js';
import workoutsRouter from './routes/workouts.js';
//import usersRouter from './routes/users.js'
import checkinRoutes from './routes/checkins.js'


config()

async function main () {
    const hostname = 'localhost';
    const port = 3000;

    const app = express()

    const mongoConnection = await Mongo.connect({ mongoConnectionString: process.env.MONGO_CS,mongoDBName: process.env.MONGO_DB_NAME})
    console.log(mongoConnection);

    app.use(express.json())
    app.use(cors())

    app.get('/', (req, res) => {
        res.send({
            success: true,
            statusCode: 200,
            body: 'Bem vindo ao Fitness & Health Planner!'
        })
    })

    //routes
    app.use('/auth', authRouter)
    app.use('/users', usersRouter)
    app.use('/profile', usersRouter)
    app.use('/exercises', exercisesRouter)
    app.use('/workouts', workoutsRouter)
    app.use('/checkins', checkinRoutes)

    app.listen(port, () => {
        console.log(`Server Running on: http://${hostname}:${port}`)
    })
}

main()
import express from 'express'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import crypto from 'crypto'
import { Mongo } from '../database/mongo.js'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { error } from 'console'

const collectionName = 'users'

const authRouter = express.Router()

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, callback) => {
    const user = await Mongo.db
    .collection(collectionName)
    .findOne({ email: email})

    if(!user){
        return callback(null, false)
    }

    const saltBuffer = user.salt.buffer

    crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', ( err, hashedPassword) => {
        if (err){
            return callback(err)
        }

        const userPasswordBuffer = Buffer.from(user.password.buffer)

        if(!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)){
            return callback(null, false)
        }

        const { password, salt, ...rest } = user

        return callback(null, rest) 
    })

}))


authRouter.post('/signup', async (req, res) => {
    const checkUser = await Mongo.db
    .collection(collectionName)
    .findOne({ email: req.body.email })

    if(checkUser){
        return res.status(500).send({
            success: false,
            statusCode: 500,
            body: {
                text: 'Esse usuário já existe!'
            }
        })
    }

    const salt = crypto.randomBytes(16)
    crypto.pbkdf2(req.body.password, salt, 310000, 16, 'sha256', async(err, hashedPassword) => {
        if(err){
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: {
                    text: 'Erro ao encriptar a senha!',
                    err: err
                }
            })
        }

        const result = await Mongo.db
        .collection(collectionName)
        .insertOne({
            fullname: req.body.fullname,
            email: req.body.email,
            password: hashedPassword,
            salt,
            role: req.body.role, // aluno ou profissional
            profileCompleted: false // para saber se ele terminou o cadastro
        })

        if(result.insertedId) {
            const user = await Mongo.db
            .collection(collectionName)
            .findOne({ _id: new ObjectId(result.insertedId) }, { projection: { password: 0, salt: 0 } })
            

            const token = jwt.sign(user, 'secret')

            return res.send({
                success: true,
                statusCode: 200,
                body: {
                    text: 'Usuário Registrado com Sucesso!',
                    token,
                    user,
                    logged: true
                }
            })
        }

    }) 

})

authRouter.post('/login', (req, res) => {
    passport.authenticate('local', (error, user) => {
        if(error){
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: {
                    text: 'Erro durante a autenticação!',
                    error
                }
            })
        }

        if(!user){
            return res.status(400).send({
                success: false,
                statusCode: 400,
                body: {
                    text: 'Credenciais incorretas!',
                
                }
            })
        }

        const token = jwt.sign(user, 'secret')
        console.log(user)
        return res.status(200).send({
            success: true,
            statusCode: 200,
            body: {
                text: 'Usuário logado com sucesso!',
                user, 
                token
            
            }

        })

    })(req, res)

})

authRouter.post('/reset-password', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).send({
        success: false,
        body: { text: 'Email e nova senha são obrigatórios.' }
        })
    }

    const user = await Mongo.db.collection(collectionName).findOne({ email })

    if (!user) {
        return res.status(200).send({
        success: true,
        body: { text: 'Se o e-mail existir, a senha foi atualizada.' } // nunca revele se o email existe
        })
    }

    const salt = crypto.randomBytes(16)
    crypto.pbkdf2(password, salt, 310000, 16, 'sha256', async (err, hashedPassword) => {
        if (err) {
        return res.status(500).send({
            success: false,
            body: { text: 'Erro ao redefinir senha.', error: err }
        })
        }

        await Mongo.db.collection(collectionName).updateOne(
        { email },
        { $set: { password: hashedPassword, salt } }
        )

        return res.status(200).send({
        success: true,
        body: { text: 'Senha atualizada com sucesso.' }
        })
    })
})



export default authRouter
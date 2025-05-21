import UsersDataAccess from "../dataAccess/users.js";

import { ok, serverError } from '../helpers/httpResponse.js'

export default class UsersControllers {
    constructor() {
        this.dataAccess = new UsersDataAccess()
    }

    async getUsers() {
        try {
            const users = await this.dataAccess.getUsers()
            // console.log(users)
            return ok(users)

        } catch (error) {
            return serverError(error)

        }
    }

    async deleteUser(userId) {
        try {
            const result = await this.dataAccess.deleteUser(userId)
            // console.log(users)
            return ok(users)

        } catch (error) {
            return serverError(error)

        }
    }

    async updateUser(userId, userData) {
        try {
            const updatedUser = await this.dataAccess.updateUser(userId, userData)
            return ok(updatedUser)  // retorna o usuário atualizado, ou o que a dataAccess retornar
        } catch (error) {
            return serverError(error)
        }
    }

    async getProfessionals() {
        try {
            const professionals = await this.dataAccess.getProfessionals()
            return ok(professionals)
        } catch (error) {
            return serverError(error)
        }
    }

    async getUserProfile(userId) {
        try {
        const user = await this.dataAccess.getUserById(userId);
        if (!user) {
            return {
            success: false,
            statusCode: 404,
            body: { message: "Usuário não encontrado." }
            };
        }
        return ok(user);
        } catch (error) {
        return serverError(error);
        }
    }

}
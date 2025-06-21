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
    const workoutId = req.params.id;
    const { pickupStatus } = req.body;

    const workout = await Mongo.db.collection('workouts').findOne({ _id: new ObjectId(workoutId) });

    if (!workout) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        body: "Treino não encontrado."
      });
    }

    const now = new Date();
    const durationDate = new Date(workout.duration + "T23:59:59");

    console.log("Verificando data limite:", durationDate, "| Agora:", now);

    // ⚠️ BLOQUEIO ABSOLUTO: não permite nenhuma alteração se já passou da data
    if (now >= durationDate) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        body: "Não é possível alterar o status de um treino que já passou da data final."
      });
    }

    // ⚠️ Verifica se já existe outro treino em andamento
    if (pickupStatus === "Em andamento") {
      const existingInProgress = await Mongo.db.collection('workouts').findOne({
        userId: workout.userId,
        pickupStatus: "Em andamento",
        _id: { $ne: new ObjectId(workoutId) }
      });

      if (existingInProgress) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          body: "Já existe outro treino em andamento para este usuário. Finalize-o antes de alterar outro para 'Em andamento'."
        });
      }
    }

    // ✅ Atualiza o status normalmente
    const updateResult = await Mongo.db.collection('workouts').updateOne(
      { _id: new ObjectId(workoutId) },
      { $set: { pickupStatus } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        body: "Status do treino não foi alterado."
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      body: "Status do treino atualizado com sucesso."
    });

  } catch (error) {
    console.error("Erro ao atualizar status do treino:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      body: "Erro ao atualizar status do treino."
    });
  }
}

}

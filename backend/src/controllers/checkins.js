import CheckinDataAccess from "../dataAccess/checkins.js"
import { ok, serverError } from "../helpers/httpResponse.js"

export default class CheckinController {
  constructor() {
    this.dataAccess = new CheckinDataAccess()
  }

 async addCheckin(req, res) {
    try {
      const { userId, workoutId, checkedIn, note } = req.body;

      // Verifica se já existe check-in hoje
      const existingCheckin = await this.dataAccess.getTodayCheckin(userId);
      if (existingCheckin) {
        return res.status(200).json({
          alreadyCheckedIn: true,
          message: "Check-in já realizado hoje.",
          checkin: existingCheckin
        });
      }

      const result = await this.dataAccess.addCheckin({ userId, workoutId, checkedIn, note });
      return res.status(201).json({
        alreadyCheckedIn: false,
        message: "Check-in realizado com sucesso.",
        checkin: result
      });
    } catch (error) {
      console.error("Erro ao adicionar check-in:", error);
      return res.status(500).json(serverError(error));
    }
  }


  async getCheckinsByUser(req, res) {
    try {
      const { userId } = req.params

      const result = await this.dataAccess.getCheckinsByUserId(userId)
      return res.status(200).json(ok(result))
    } catch (error) {
      console.error("Erro ao buscar check-ins:", error)
      return res.status(500).json(serverError(error))
    }
  }
}

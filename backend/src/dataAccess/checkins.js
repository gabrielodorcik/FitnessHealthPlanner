import { Mongo } from "../database/mongo.js"
import { ObjectId } from "mongodb"

const collectionName = "checkins"

export default class CheckinDataAccess {
  async addCheckin({ userId, workoutId, checkedIn, note }) {
    const checkin = {
      userId: new ObjectId(userId),
      workoutId: new ObjectId(workoutId),
      checkedIn,
      note,
      createdAt: new Date()
    }

    const result = await Mongo.db.collection(collectionName).insertOne(checkin)
    return result
  }

  async getCheckinsByUserId(userId) {
    const result = await Mongo.db
      .collection(collectionName)
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()

    return result
  }

  async getTodayCheckin(userId) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const result = await Mongo.db
      .collection(collectionName)
      .findOne({
        userId: new ObjectId(userId),
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });

    return result;
  }


}

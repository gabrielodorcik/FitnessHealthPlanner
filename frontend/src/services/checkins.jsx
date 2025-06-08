import { useState } from "react"

export default function useCheckinService() {
  const [checkinLoading, setCheckinLoading] = useState(false)
  const [checkinList, setCheckinList] = useState([])

  const url = "http://localhost:3000/checkins"

  const sendCheckin = async ({ userId, workoutId, checkedIn, note }) => {
    setCheckinLoading(true)
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, workoutId, checkedIn, note })
      })
      const result = await res.json()
      return result
    } catch (error) {
      console.error("Erro ao enviar check-in:", error)
    } finally {
      setCheckinLoading(false)
    }
  }

  const getCheckinsByUser = async (userId) => {
    setCheckinLoading(true)
    try {
      const res = await fetch(`${url}/user/${userId}`)
      const result = await res.json()
      setCheckinList(result.body || [])
      return result.body || []
    } catch (error) {
      console.error("Erro ao buscar check-ins:", error)
      setCheckinList([])
    } finally {
      setCheckinLoading(false)
    }
  }

  return {
    checkinLoading,
    checkinList,
    sendCheckin,
    getCheckinsByUser
  }
}

import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import useAuthServices from '../../services/auth'
import useWorkoutServices from "../../services/workout"
import useCheckinService from "../../services/checkins"
import styles from './page.module.css'
import Loading from "../loading/page"

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"

export default function Performance() {
  const navigate = useNavigate()
  const { logout } = useAuthServices()
  const {
    getUserWorkouts,
    workoutLoading,
    refetchWorkouts,
    setRefetchWorkouts,
    workoutsList = []
  } = useWorkoutServices()

  const { getCheckinsByUser } = useCheckinService()
  const [checkinData, setCheckinData] = useState([])
  const [progressData, setProgressData] = useState([])
  const [totalCheckins, setTotalCheckins] = useState(0)

  const authData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("auth"))
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    if (!authData?.user?._id) {
      navigate("/auth")
    } else if (refetchWorkouts) {
      getUserWorkouts(authData.user._id)
      setRefetchWorkouts(false)
    }
  }, [authData, refetchWorkouts])

  useEffect(() => {
    if (authData?.user?._id && workoutsList.length > 0) {
      fetchCheckins()
    }
  }, [authData, workoutsList])

  const countTrainingDays = (createdAt, endDate, type) => {
    if (!createdAt || !endDate || !type) return 0

    const routineLetters = type.split("")
    const cycle = [...routineLetters, "Folga"]

    const start = new Date(createdAt)
    const end = new Date(endDate)

    let count = 0
    let dayIndex = 0

    for (
      let d = new Date(start);
      d <= end;
      d.setDate(d.getDate() + 1), dayIndex++
    ) {
      const cycleIndex = dayIndex % cycle.length
      if (cycle[cycleIndex] !== "Folga") {
        count++
      }
    }

    return count
  }

  const fetchCheckins = async () => {
    const checkins = await getCheckinsByUser(authData.user._id)

    const counts = checkins.reduce(
      (acc, c) => {
        if (c.checkedIn === true) acc.completed++
        else acc.notCompleted++
        return acc
      },
      { completed: 0, notCompleted: 0 }
    )

    setCheckinData([
      { name: "Concluído", value: counts.completed, color: "#5cb85c" },
      { name: "Não concluído", value: counts.notCompleted, color: "#d9534f" }
    ])

    setTotalCheckins(checkins.length)

    const currentWorkout = workoutsList.find(w => w.pickupStatus === "Em andamento")
    if (currentWorkout) {
      const currentCheckins = checkins.filter(c => c.workoutId === currentWorkout._id)

      const totalDays = countTrainingDays(
        currentWorkout.createdAt,
        currentWorkout.duration,
        currentWorkout.type
      )

      const completed = currentCheckins.filter(c => c.checkedIn === true).length
      const remaining = totalDays - completed

      setProgressData([
        { name: "Check-ins", value: completed, color: "#5cb85c" },
        { name: "Faltando", value: remaining > 0 ? remaining : 0, color: "#d9534f" }
      ])
    }
  }

  const workoutStatusData = [
    { name: "Em andamento", value: workoutsList.filter(w => w.pickupStatus === "Em andamento").length, color: "#f0ad4e" },
    { name: "Finalizado", value: workoutsList.filter(w => w.pickupStatus === "Finalizado").length, color: "#5cb85c" },
    { name: "Cancelado", value: workoutsList.filter(w => w.pickupStatus === "Cancelado").length, color: "#d9534f" }
  ]

  if (workoutLoading) return <Loading />

  return (
    <div className={styles.pageContainer}>
      <div className={styles.dashboardRow}>
        <div className={styles.chartBox}>
          <h2>Total de Treinos</h2>
          <div className={styles.counterBox}>
            <span className={styles.counterNumber}>{workoutsList.length}</span>
          </div>
        </div>

        <div className={styles.chartBox}>
          <h2>Total de Check-ins</h2>
          <div className={styles.counterBox}>
            <span className={styles.counterNumber}>{totalCheckins}</span>
          </div>
        </div>

        {[{
          title: "Status dos Treinos",
          data: workoutStatusData,
          emptyMsg: "Nenhum treino encontrado."
        }, {
          title: "Status dos Check-ins",
          data: checkinData,
          emptyMsg: "Nenhum check-in encontrado."
        }, {
          title: "Progresso do Treino Atual",
          data: progressData,
          emptyMsg: "Sem treino em andamento."
        }].map(({ title, data, emptyMsg }, i) => (
          <div key={i} className={styles.chartBox}>
            <h2>{title}</h2>
            <div style={{ width: "100%", height: 300 }}>
              {data.length === 0 ? (
                <p>{emptyMsg}</p>
              ) : (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}`} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

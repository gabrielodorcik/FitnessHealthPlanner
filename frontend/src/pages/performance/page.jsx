import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import useAuthServices from '../../services/auth'
import useWorkoutServices from "../../services/workout"
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
  }, [authData, refetchWorkouts, getUserWorkouts, setRefetchWorkouts, navigate])

  console.log("workoutsList:", workoutsList);

  const handleLogout = () => {
    logout()
    navigate("/auth")
  }

  // Contar status para o gráfico
  const counts = workoutsList.reduce(
    (acc, p) => {
      if (p.pickupStatus === "Em andamento") acc.inProgress++
      else if (p.pickupStatus === "Finalizado") acc.completed++
      else if (p.pickupStatus === "Cancelado") acc.canceled++
      return acc
    },
    { inProgress: 0, completed: 0, canceled: 0 }
  )

  // Dados formatados para o recharts
  const data = [
    { name: "Em andamento", value: counts.inProgress, color: "#f0ad4e" },
    { name: "Finalizado", value: counts.completed, color: "#5cb85c" },
    { name: "Cancelado", value: counts.canceled, color: "#d9534f" }
  ]

  if (workoutLoading) {
    return <Loading />
  }
  

  const testData = [
  { name: "Em andamento", value: 3, color: "#f0ad4e" },
  { name: "Finalizado", value: 5, color: "#5cb85c" },
  { name: "Cancelado", value: 2, color: "#d9534f" }
];

  return (
    <div className={styles.pageContainer}>
    

      <div className={styles.nameContainer}>
        <h1>Dashboard dos Treinos</h1>

        <div style={{ width: "100%", height: 350 }}>
            {workoutsList.length === 0 ? (
                <p>Nenhum treino encontrado para mostrar no dashboard.</p>
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
                    <Tooltip formatter={(value) => `${value} treinos`} />
                    <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
      </div>

      {/* <button onClick={handleLogout}>Sair</button> */}
    </div>
  )
}

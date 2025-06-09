import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import authServices from '../../services/auth'
import useWorkoutServices from "../../services/workout"
import styles from './page.module.css'
import { BiTimeFive, BiAlarmExclamation } from "react-icons/bi"
import { LuCircleCheckBig } from "react-icons/lu"
import Loading from "../loading/page"
import { MdEdit } from "react-icons/md";

export default function Workouts() {
  const navigate = useNavigate()

  const { logout } = authServices()
  const {
    getUserWorkouts,
    workoutLoading,
    refetchWorkouts,
    setRefetchWorkouts,
    workoutsList, 
    updateWorkoutStatusController
  } = useWorkoutServices()

  const authData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("auth"))
    } catch {
      return null
    }
  }, [])

  const [statusFilter, setStatusFilter] = useState("Geral")

  useEffect(() => {
    if (!authData) {
      navigate("/auth")
    } else if (refetchWorkouts) {
      getUserWorkouts(authData?.user?._id)
    }
  }, [authData, refetchWorkouts])

  const handleLogout = () => {
    logout()
    return navigate("/auth")
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateWorkoutStatusController(id, newStatus)
      setRefetchWorkouts(true)

      if (newStatus === 'Editando') {
        navigate("/newWorkout")
      }
    } catch (err) {
      alert(err?.response?.data?.body || "Erro ao atualizar o status do treino.")
    }
  }

  const filteredWorkouts = statusFilter === "Geral"
    ? workoutsList
    : workoutsList.filter(w => w.pickupStatus === statusFilter)

  if (workoutLoading) {
    return <Loading />
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.nameContainer}>
        <h1>Bem vindo {authData?.user?.fullname}!</h1>
      </div>

      <div className={styles.nameContainer}>
        <h1>Meus Treinos</h1>
        <p>
          {" "}
          {new Date().toLocaleDateString("PT-BR", {
            weekday: "long",
            day: "numeric",
            month: "long"
          }).toUpperCase()}
        </p>

       


      </div>

       <div className={styles.statusButtonsContainer}>
          {["Geral", "Em andamento", "Finalizado", "Cancelado", "Editando"].map((status) => (
            <button
              key={status}
              className={`${styles.statusButton} ${statusFilter === status ? styles.active : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

      {filteredWorkouts.length > 0 ? (
        <div className={styles.workoutsContainer}>
          {filteredWorkouts.map((workout) => (
            <div key={workout._id} className={styles.workoutContainer}>
              <h2 className={styles.titleName}>{workout.workoutName || "Sem nome"}</h2>
              <h4>Treino para: {workout.assignedToId || authData?.user?.fullname}</h4>
              <h4>Tipo: {workout.type}</h4>

              <div>
                {workout.pickupStatus === "Em andamento" && (
                  <p className={`${styles.pickupStatus} ${styles.pending}`}>
                    Status: <BiTimeFive /> {workout.pickupStatus}
                  </p>
                )}
                {workout.pickupStatus === "Finalizado" && (
                  <p className={`${styles.pickupStatus} ${styles.completed}`}>
                    Status: <LuCircleCheckBig /> {workout.pickupStatus}
                  </p>
                )}
                {workout.pickupStatus === "Cancelado" && (
                  <p className={`${styles.pickupStatus} ${styles.notCompleted}`}>
                    Status: <BiAlarmExclamation /> {workout.pickupStatus}
                  </p>
                )}
                {workout.pickupStatus === "Editando" && (
                  <p className={`${styles.pickupStatus} ${styles.editing}`}>
                    Status: <MdEdit /> {workout.pickupStatus}
                  </p>
                )}

                {authData.user._id && (
                  <select
                    value={workout.pickupStatus}
                    onChange={(e) => handleStatusChange(workout._id, e.target.value)}
                  >
                    <option value="Em andamento">Em andamento</option>
                    <option value="Finalizado">Finalizado</option>
                    <option value="Cancelado">Cancelado</option>
                    <option value="Editando">Editando</option>
                  </select>
                )}
              </div>

              <h4>Descrição: {workout.description}</h4>
              <h3>Grupo Muscular: {workout.muscleFocus}</h3>

              {workout.workoutItems.map((item) => (
                <div key={item._id}>
                  <h4>Exercício: {item.itemDetails[0]?.name}</h4>
                  <p>Grupo: {item.itemDetails[0]?.muscleGroup}</p>
                  <p>Rotina: {item.label}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div>
          Nenhum treino encontrado para o filtro selecionado.
          
        </div>
      )}
    </div>
  )
}

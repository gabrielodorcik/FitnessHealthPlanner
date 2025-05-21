import { useEffect, useMemo } from "react"
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
    await updateWorkoutStatusController(id, newStatus)

    if (newStatus === 'Editando') {
      navigate("/newWorkout")
    }
  }

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
          Hoje:{" "}
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long"
          })}
        </p>
      </div>

      {workoutsList.length > 0 ? (
        <div className={styles.workoutsContainer}>
          {workoutsList.map((workout) => (
            <div key={workout._id} className={styles.workoutContainer}>
              <h2>Nome: {workout.workoutName}</h2>
              <h4>Treino para: {workout.assignedToId}</h4>

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

              <h4>Descrição: {workout.description}</h4>
              <h3>Grupo Muscular: {workout.muscleFocus}</h3>

              {workout.workoutItems.map((item) => (
                <div key={item._id}>
                  <h4>Exercício: {item.itemDetails[0]?.name}</h4>
                  <p>Grupo: {item.itemDetails[0]?.muscleGroup}</p>
                  <p>Rotina: {item.itemDetails[0]?.label}</p>
                </div>
              ))}

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
          ))}
        </div>
      ) : (
        <div>
          Nenhum treino ainda
          <Link to={"/newWorkout"} className={styles.linkCreateNew}>
            {" "}
            Clique aqui para começar um treino novo!{" "}
          </Link>
        </div>
      )}
    </div>
  )
}

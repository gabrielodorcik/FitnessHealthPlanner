import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import authServices from '../../services/auth'
import useWorkoutServices from "../../services/workout"
import checkinServices from '../../services/checkins'
import styles from './page.module.css'
import Loading from "../loading/page"
import CompletePortalPopup from "../../components/completeprofilePopup/completeprofilePopup"
import CheckinPopup from "../../components/checkinPopup/checkinPopup"
import { BiTimeFive } from "react-icons/bi"
import { LuCircleCheckBig } from "react-icons/lu"
import { MdEdit } from "react-icons/md"
import { BiAlarmExclamation } from "react-icons/bi"

import { toast } from 'react-toastify';

import useCheckinService from '../../services/checkins'


export default function Portal() {
    const { logout, completePortal } = authServices()
    const {
        getUserWorkouts,
        workoutLoading,
        workoutsList,
        refetchWorkouts,
        setRefetchWorkouts
    } = useWorkoutServices()

    const navigate = useNavigate()

    const checkinServices = useCheckinService()

    const [selectedImage, setSelectedImage] = useState(null)


    const authData = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('auth'))
        } catch {
            return null
        }
    }, [])

    const [showPopup, setShowPopup] = useState(false)
    const [showCheckinPopup, setShowCheckinPopup] = useState(false)

    useEffect(() => {
        if (!authData) {
            navigate('/auth')
        } else if (refetchWorkouts || workoutsList.length === 0) {
            getUserWorkouts(authData.user._id)
            setRefetchWorkouts(false)
        }
    }, [authData, refetchWorkouts])

    const handleCheckinSubmit = async ({ result, observation }) => {
        try {
            const response = await checkinServices.sendCheckin({
                userId: authData.user._id,
                workoutId: workout?._id,
                checkedIn: result,
                note: observation,
            });

            if (response?.alreadyCheckedIn) {
                const date = new Date(response.checkin.createdAt).toLocaleTimeString('pt-BR');
                toast.info(`Você já fez check-in hoje às ${date}.`);
            } else {
                toast.success('Check-in enviado com sucesso!');
            }

            setShowCheckinPopup(false);
        } catch (error) {
            console.error(error);
            toast.error('Erro ao enviar check-in');
        }
    };


    const handleCheckinClick = async () => {
        const checkins = await checkinServices.getCheckinsByUser(authData.user._id);
        const today = new Date().toDateString();

        const todayCheckin = checkins.find(c => new Date(c.createdAt).toDateString() === today);

        if (todayCheckin) {
            const time = new Date(todayCheckin.createdAt).toLocaleTimeString('pt-BR');
            toast.info(`Você já fez check-in hoje às ${time}.`);
        } else {
            setShowCheckinPopup(true);
        }
    };



    const handleLogout = () => {
        logout()
        navigate('/auth')
    }

    // const handleCompletePortal = async (formData) => {
    //     try {
    //         const response = await completePortal(authData.user._id, formData)
    //         const updatedAuth = {
    //             ...authData,
    //             user: {
    //                 ...authData.user,
    //                 ...response,
    //                 profileCompleted: true
    //             }
    //         }
    //         localStorage.setItem('auth', JSON.stringify(updatedAuth))
    //         setShowPopup(false)
    //     } catch (err) {
    //         console.error("Erro ao atualizar:", err)
    //     }
    // }

    function getRoutineForToday(createdAt, type) {
        if (!createdAt || !type) return null;

        const routineLetters = type.split("");
        const cycle = [...routineLetters, "Folga"];

        const createdDate = new Date(createdAt);
        const today = new Date();

        const createdDateOnly = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const diffInDays = Math.floor((todayOnly - createdDateOnly) / (1000 * 60 * 60 * 24));

        if (diffInDays < 0) return null;

        const index = diffInDays % cycle.length;
        return cycle[index];
    }

    if (!authData || !authData.user || workoutLoading) return <Loading />

    const workout = workoutsList.find(w => w.pickupStatus === "Em andamento");
    const routineToday = getRoutineForToday(workout?.createdAt, workout?.type);
    const filteredItems = workout?.workoutItems?.filter(item => item.label === routineToday);


    const muscleGroupsToday = [...new Set(
        filteredItems?.map(item => item.itemDetails?.[0]?.muscleGroup).filter(Boolean)
    )];


    const getStatusStyle = (status) => {
        switch (status) {
            case "Em andamento":
                return `${styles.pickupStatus} ${styles.pending}`
            case "Finalizado":
                return `${styles.pickupStatus} ${styles.completed}`
            case "Cancelado":
                return `${styles.pickupStatus} ${styles.notCompleted}`
            case "Editando":
                return `${styles.pickupStatus} ${styles.editing}`
            default:
                return styles.pickupStatus
        }
    }

    return (
        <div className={styles.portalContent}>
            <div className={styles.headerRow}>
                <h2 className={styles.welcome}>
                Bem-vindo(a), {authData?.user?.fullname?.split(" ")[0]}
                </h2>

                <div className={styles.buttonsBox}>
                    <button className={styles.primaryButton} onClick={() => navigate('/workouts')}>
                        Ver treino completo
                    </button>

                    <button className={styles.secondaryButton} onClick={() => setShowCheckinPopup(true)}>
                        Check-in
                    </button>
                </div>

            


            </div>
            

            <div className={styles.dailyWorkoutBox}>
                {/* <p>Rotina de hoje: {routineToday || "Não definida"}</p> */}
                <h3>Treino do dia</h3>

                {!workout && <p>Você não tem treinos em andamento.</p>}

                {workout && (
                    <div className={styles.workoutContainer}>
                        <h2>Nome: {workout.workoutName || "Sem nome"}</h2>
                        <h4>Treino para: {workout.assignedToId || authData?.user?.fullname}</h4>
                        
                        
                    <h4>
                      Duração até:{workout.duration}
                      
                    </h4>



                        <div>
                            <p className={getStatusStyle(workout.pickupStatus)}>
                                Status:{" "}
                                {workout.pickupStatus === "Em andamento" && <><BiTimeFive /> {workout.pickupStatus}</>}
                                {workout.pickupStatus === "Finalizado" && <><LuCircleCheckBig /> {workout.pickupStatus}</>}
                                {workout.pickupStatus === "Cancelado" && <><BiAlarmExclamation /> {workout.pickupStatus}</>}
                                {workout.pickupStatus === "Editando" && <><MdEdit /> {workout.pickupStatus}</>}
                            </p>
                        </div>

                        {/* <h4>Descrição: {workout.description}</h4> */}
                        
                        
                        <div className={styles.routineInfoRow}>
                            <div className={styles.routineLabel}>
                                <h4>Rotina de hoje:</h4>
                                <p>{routineToday || "Não definida"}</p>
                            </div>

                            <div className={styles.muscleGroups}>
                                <h4>Grupos Musculares:</h4>
                                <ul>
                                    {muscleGroupsToday.length > 0 ? (
                                        muscleGroupsToday.map((group, index) => (
                                            <li key={index}>{group}</li>
                                        ))
                                    ) : (
                                        <li>Não definido</li>
                                    )}
                                </ul>
                            </div>
                        </div>




                        
                        <div className={styles.exercisesGrid}>
                            {filteredItems && filteredItems.length > 0 ? filteredItems.map((item) => (
                                <div key={item._id} className={styles.exerciseCard}>
                                    <div className={styles.exerciseImage}>
                                        <img
                                            src={item.itemDetails?.[0]?.imgUrl || "/placeholder.jpg"}
                                            alt={item.itemDetails?.[0]?.name || "Exercício"}

                                            onClick={() => setSelectedImage(item.itemDetails?.[0]?.imgUrl)}
                                              style={{ cursor: "pointer" }}

                                        />
                                    </div>
                                    <div className={styles.exerciseInfo}>
                                        <h4>{item.itemDetails?.[0]?.name || item.exerciseName}</h4>
                                        <p><strong>Grupo:</strong> {item.itemDetails?.[0]?.muscleGroup || "Não definido"}</p>
                                        <p><strong>Rotina:</strong> {item.label || "Sem rotina"}</p>
                                        <p><strong>Reps/Sets:</strong> {item.sets || "-"}x{item.reps || "-"}</p>
                                        <p><strong>Carga:</strong> {item.weight || 0}kg</p>
                                    </div>
                                </div>
                            )) : (
                                <p>Nenhum exercício para a rotina de hoje.</p>
                            )}
                        </div>



                    </div>
                )}
            </div>

            <div className={styles.buttonsBox}>
                <button className={styles.primaryButton} onClick={() => navigate('/workouts')}>
                    Ver treino completo
                </button>

                <button className={styles.secondaryButton} onClick={handleCheckinClick}>
                    Check-in
                </button>
            </div>

            {showCheckinPopup && (
                <CheckinPopup
                    onClose={() => setShowCheckinPopup(false)}
                    onSubmit={handleCheckinSubmit}
                />
            )}


            {selectedImage && (
              <div className={styles.imageModalOverlay} onClick={() => setSelectedImage(null)}>
                <div className={styles.imageModalContent}>
                  <img src={selectedImage} alt="Imagem ampliada" />
                </div>
              </div>
            )}

        </div>
    )
}

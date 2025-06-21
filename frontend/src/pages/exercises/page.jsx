import authServices from '../../services/auth'
import exerciseServices from '../../services/exercises'
import styles from './page.module.css'
import { useEffect, useState } from 'react'
import Loading from '../loading/page'
import ExerciseCard from '../../components/exerciseCard/exerciseCard'
import ExercisePopup from '../../components/exercisePopup/exercisePopup'
import { FaCheckCircle } from "react-icons/fa";
import { useWorkoutContext } from '../../contexts/useWorkoutContext'
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

export default function Exercises() {
    const { getAvailableExercises, exercisesList, exerciseLoading, refetchExercises } = exerciseServices()
    const [exerciseSelected, setExerciseSelected] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState("all");
    const { addToWorkout, workoutItems } = useWorkoutContext()

    const authData = JSON.parse(localStorage.getItem('auth'));
    const navigate = useNavigate()

    useEffect(() => {
        if (refetchExercises) {
            getAvailableExercises()
        }
    }, [refetchExercises])

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (workoutItems.length > 0) {
                e.preventDefault()
                e.returnValue = "Você perderá os exercícios adicionados ao treino. Deseja continuar?"
            }
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [workoutItems])

    const filteredExercises = selectedGroup === "all"
        ? exercisesList
        : selectedGroup === "myWorkout"
            ? exercisesList.filter(ex => workoutItems.some(item => item._id === ex._id))
            : exercisesList.filter(ex => ex.muscleGroup === selectedGroup)

    const uniqueGroups = [...new Set(exercisesList.map(ex => ex.muscleGroup))]

    const handleExerciseSelected = (exercise) => {
        setExerciseSelected(exercise)
    }

    const handleClosePopup = () => {
        setExerciseSelected(null)
    }

    const handleAddToWorkout = (itemToAdd) => {
        addToWorkout(itemToAdd)
        toast.success("Exercício adicionado com sucesso!");
        handleClosePopup()
    }

    if (exerciseLoading) {
        return (<Loading />)
    }

    return (
        <>
            <div>
                {/* Filtros e botão */}
                <div className={styles.groupButtonsContainer}>
                    <div className={styles.groupButtonsLeft}>
                        <button onClick={() => {
                            if (!authData) {
                                toast.info("Você não está logado ainda. Deseja entrar com sua conta? Clique aqui para fazer login.", {
                                    onClick: () => navigate('/auth'),
                                    autoClose: 5000
                                });
                            } else {
                                navigate('/newWorkout');
                            }
                        }}>
                            Ver Treino
                        </button>
                    </div>

                    <div className={styles.groupButtonsRight}>
                        {["all", ...uniqueGroups, "myWorkout"].map((group) => (
                            <button
                                key={group}
                                className={`${styles.groupButton} ${selectedGroup === group ? styles.active : ""}`}
                                onClick={() => setSelectedGroup(group)}
                            >
                                {group === "all" ? "Todos" : group === "myWorkout" ? "No meu treino" : group}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grade de exercícios */}
                <div className={styles.gridContainer}>
                    {filteredExercises.map((exercise) => {
                        const isSelected = workoutItems.some(item => item._id === exercise._id)

                        return (
                            <div
                                key={exercise._id}
                                className={styles.cardWrapper}
                                onClick={() => {
                                    if (!authData) {
                                        toast.info("Você não está logado ainda. Deseja entrar com sua conta? Clique aqui para fazer login.", {
                                            onClick: () => navigate('/auth'),
                                            autoClose: 5000
                                        });
                                    } else {
                                        handleExerciseSelected(exercise);
                                    }
                                }}
                            >
                                {isSelected && (
                                    <div className={styles.checkOverlay}>
                                        <FaCheckCircle className={styles.checkIcon} />
                                    </div>
                                )}
                                <ExerciseCard exerciseData={exercise} />
                            </div>
                        )
                    })}
                </div>

                {/* Popup do exercício */}
                {exerciseSelected && (
                    <ExercisePopup
                        exerciseData={exerciseSelected}
                        onClose={handleClosePopup}
                        onAddToWorkout={handleAddToWorkout}
                    />
                )}
            </div>
        </>
    )
}

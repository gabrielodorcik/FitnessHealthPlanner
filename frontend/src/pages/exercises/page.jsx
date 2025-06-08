import authServices from '../../services/auth'
import exerciseServices from '../../services/exercises'
import styles from './page.module.css'
import { useEffect, useState } from 'react'
import Loading from '../loading/page'
import ExerciseCard from '../../components/exerciseCard/exerciseCard'
import ExercisePopup from '../../components/exercisePopup/exercisePopup'
import { FaCheckCircle } from "react-icons/fa";
import { useWorkoutContext } from '../../contexts/useWorkoutContext'

export default function Exercises() {

    const { getAvailableExercises, exercisesList, exerciseLoading, refetchExercises  } = exerciseServices()
    const [exerciseSelected, setExerciseSelected] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState("all");
    const { addToWorkout, workoutItems} = useWorkoutContext()

     useEffect(() => {
        if(refetchExercises) {
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
       handleClosePopup()
    }


    if(exerciseLoading){
        return ( <Loading  />)
    }

    //console.log(exercisesList)
    console.log("Exercícios filtrados:", filteredExercises);

    return (
        <>
            <div>
                {/* Filtro por grupo muscular */}
                
                <div className={styles.groupButtonsContainer}>
                  {["all", ...uniqueGroups].map((group) => (
                    <button
                      key={group}
                      className={`${styles.groupButton} ${selectedGroup === group ? styles.active : ""}`}
                      onClick={() => setSelectedGroup(group)}
                    >
                      {group === "all" ? "Todos" : group}
                    </button>
                  ))}
                </div>


                {/* Grade de exercícios */}
                <div className={styles.gridContainer}>
                    {filteredExercises.map((exercise) => {
                    
                        const isSelected = workoutItems.some(item => item._id === exercise._id)

                                  return (
                                    <div
                                      key={exercise._id}
                                      className={styles.cardWrapper}
                                      onClick={() => handleExerciseSelected(exercise)}
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


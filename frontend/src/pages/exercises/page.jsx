import authServices from '../../services/auth'
import exerciseServices from '../../services/exercises'
import styles from './page.module.css'
import { useEffect, useState } from 'react'
import Loading from '../loading/page'
import ExerciseCard from '../../components/exerciseCard/exerciseCard'
import ExercisePopup from '../../components/exercisePopup/exercisePopup'
import { useWorkoutContext } from '../../contexts/useWorkoutContext'

export default function Exercises() {

    const { getAvailableExercises, exercisesList, exerciseLoading, refetchExercises  } = exerciseServices()
    const [exerciseSelected, setExerciseSelected] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState("all");
    const { addToWorkout } = useWorkoutContext()

     useEffect(() => {
        if(refetchExercises) {
            getAvailableExercises()
        }

    }, [refetchExercises])

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
                <select onChange={(e) => setSelectedGroup(e.target.value)} value={selectedGroup}>
                    <option value="all">Todos</option>
                    {uniqueGroups.map((group, index) => (
                    <option key={index} value={group}>{group}</option>
                    ))}
                </select>

                {/* Grade de exercícios */}
                <div className={styles.gridContainer}>
                    {filteredExercises.map((exercise) => (
                    <div
                        key={exercise._id}
                        className={styles.cardWrapper}
                        onClick={() => setExerciseSelected(exercise)}
                    >
                        <ExerciseCard exerciseData={exercise} />
                    </div>
                    ))}
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

{/* {exercisesList.map((exercise) => (
                    <div>
                        <div key={exercise._id} className={styles.cardContainer} onClick={() => { handleExerciseSelected(exercise)}}>
                            <ExerciseCard exerciseData={exercise} />
                        </div>
                    </div>
                ))} */}
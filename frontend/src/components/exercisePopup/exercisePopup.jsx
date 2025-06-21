import { Dialog } from "@mui/material";
import styles from './exercisePopup.module.css'
import { useWorkoutContext } from "../../contexts/useWorkoutContext"
import { toast } from 'react-toastify';


export default function ExercisePopup({exerciseData, onClose, onAddToWorkout}){

    const { workoutItems, removeFromWorkout } = useWorkoutContext();
    const isAlreadyInWorkout = workoutItems.some(item => item._id === exerciseData._id);


    
    return (
        <Dialog open={true} onClose={onClose}>

            <div className={styles.popupContainer}>
                <img src={exerciseData.imgUrl} alt="" />
                <div className={styles.popuContent}>
                    <h2>{exerciseData.name}</h2>
                    <p>{exerciseData.muscleGroup}</p>
                    
                    <div className={styles.buttonRow}>
                        {!isAlreadyInWorkout && (
                            <button onClick={() => onAddToWorkout(exerciseData)}>
                                Adicionar ao Treino
                            </button>
                        )}

                        {isAlreadyInWorkout && (
                            <button onClick={() => {                        
                                removeFromWorkout(exerciseData._id);
                                toast.success("Exercício removido com sucesso!");
                                onClose();
                            }}>
                                Remover do Treino
                            </button>
                        )}
                    </div>

                </div>
            </div>

        </Dialog>
    )
}